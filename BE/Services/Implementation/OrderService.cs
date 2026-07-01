using BE.Constants;
using BE.Data;
using BE.Middlewares;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    /// <summary>
    /// Service xử lý các nghiệp vụ liên quan đến đơn hàng (Order), 
    /// bao gồm xem trước (preview) và đặt hàng (place order).
    /// Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu.
    /// </summary>
    public class OrderService : IOrderService
    {
        private const string CodPaymentMethod = "cod";
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách địa chỉ nhận hàng của người dùng.
        /// Ưu tiên địa chỉ mặc định lên đầu.
        /// </summary>
        public async Task<List<CheckoutAddressDto>> GetUserAddressesAsync(string userId)
        {
            return await _context.UserAddressesEnumerable
                .Where(address => address.UserId == userId)
                .OrderByDescending(address => address.IsDefault)
                .ThenBy(address => address.Id)
                .Select(address => new CheckoutAddressDto
                {
                    Id = address.Id,
                    FullName = address.FullName,
                    PhoneNumber = address.PhoneNumber.ToString(),
                    City = address.City,
                    StreetName = address.StreetName,
                    HouseNo = address.HouseNo,
                    IsDefault = address.IsDefault
                })
                .ToListAsync();
        }

        /// <summary>
        /// Xem trước thông tin thanh toán cho các mặt hàng trong giỏ hàng.
        /// </summary>
        public async Task<CheckoutPreviewResponse> PreviewCartCheckoutAsync(string userId, CheckoutPreviewRequest request)
        {
            ValidatePaymentMethod(request.PaymentMethod);

            UserAddresses? address = null;
            if (request.AddressId.HasValue && request.AddressId.Value > 0)
            {
                address = await GetUserAddressAsync(userId, request.AddressId.Value);
            }

            var cartItems = await GetSelectedCartItemsAsync(userId, request.CartItemIds);
            var pricing = await BuildPricingAsync(cartItems, request.VoucherCodes);

            return BuildPreviewResponse("cart", request.PaymentMethod, address, pricing);
        }

        /// <summary>
        /// Thực hiện đặt hàng từ các sản phẩm được chọn trong giỏ hàng.
        /// Sau khi đặt thành công sẽ xóa sản phẩm tương ứng trong giỏ.
        /// Sử dụng Transaction: nếu có lỗi sẽ rollback toàn bộ.
        /// </summary>
        public async Task<PlaceOrderResponse> PlaceCartOrderAsync(string userId, CheckoutPlaceOrderRequest request)
        {
            ValidatePaymentMethod(request.PaymentMethod);

            if (request.AddressId <= 0)
                throw new AppException("Please provide a valid shipping address.", 400);

            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Thu thập dữ liệu và tính toán giá
                var address = await GetUserAddressAsync(userId, request.AddressId);
                var cartItems = await GetSelectedCartItemsAsync(userId, request.CartItemIds);
                var pricing = await BuildPricingAsync(cartItems, request.VoucherCodes);

                // 2. Tạo đơn hàng vào database
                var order = await CreateOrderAsync(userId, address, request.PaymentMethod, pricing);

                // 3. Trừ tồn kho và cập nhật trạng thái sản phẩm
                await DeductInventoryAsync(pricing.SourceItems);

                // 4. Xóa các item đã thanh toán khỏi giỏ hàng
                _context.CartItems.RemoveRange(cartItems.Select(item => item.CartItem));
                await _context.SaveChangesAsync();

                await tx.CommitAsync();

                return new PlaceOrderResponse
                {
                    OrderId = order.OrderId,
                    OrderStatus = order.Status,
                    PaymentStatus = order.PaymentStatus,
                    FinalAmount = order.FinalAmount
                };
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        /// <summary>
        /// Xem trước thông tin thanh toán cho hình thức "Mua ngay" (không qua giỏ hàng).
        /// </summary>
        public async Task<CheckoutPreviewResponse> PreviewBuyNowAsync(string userId, BuyNowRequest request)
        {
            ValidatePaymentMethod(request.PaymentMethod);

            UserAddresses? address = null;
            if (request.AddressId.HasValue && request.AddressId.Value > 0)
            {
                address = await GetUserAddressAsync(userId, request.AddressId.Value);
            }

            var buyNowItem = await BuildBuyNowItemAsync(request);
            var pricing = await BuildPricingAsync(new List<CheckoutSourceItem> { buyNowItem }, request.VoucherCodes);

            return BuildPreviewResponse("buy-now", request.PaymentMethod, address, pricing);
        }

        /// <summary>
        /// Thực hiện đặt hàng trực tiếp (Mua ngay).
        /// Sử dụng Transaction: nếu có lỗi sẽ rollback toàn bộ.
        /// </summary>
        public async Task<PlaceOrderResponse> PlaceBuyNowOrderAsync(string userId, BuyNowRequest request)
        {
            ValidatePaymentMethod(request.PaymentMethod);

            if (!request.AddressId.HasValue || request.AddressId.Value <= 0)
                throw new AppException("Please provide a valid shipping address.", 400);

            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                var address = await GetUserAddressAsync(userId, request.AddressId.Value);
                var buyNowItem = await BuildBuyNowItemAsync(request);
                var pricing = await BuildPricingAsync(new List<CheckoutSourceItem> { buyNowItem }, request.VoucherCodes);
                var order = await CreateOrderAsync(userId, address, request.PaymentMethod, pricing);

                // Trừ tồn kho và cập nhật trạng thái sản phẩm
                await DeductInventoryAsync(pricing.SourceItems);

                await tx.CommitAsync();

                return new PlaceOrderResponse
                {
                    OrderId = order.OrderId,
                    OrderStatus = order.Status,
                    PaymentStatus = order.PaymentStatus,
                    FinalAmount = order.FinalAmount
                };
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        // ═══════════════════════════════════════════════════════
        // Inventory Management
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// Trừ tồn kho sau khi đặt hàng thành công.
        /// - Giảm AvailableStock, tăng SoldStock trong Inventory
        /// - Nếu tổng stock của tất cả variant = 0 → auto set Product status = OUT_OF_STOCK
        /// </summary>
        private async Task DeductInventoryAsync(List<CheckoutSourceItem> sourceItems)
        {
            // Nhóm theo ProductId để xử lý auto out_of_stock
            var productIds = sourceItems.Select(i => i.ProductId).Distinct().ToList();

            foreach (var item in sourceItems)
            {
                if (!item.VariantId.HasValue)
                    continue;

                var inventory = await _context.Inventories
                    .FirstOrDefaultAsync(i => i.ProductVariantId == item.VariantId.Value);

                if (inventory == null)
                    throw new AppException($"Inventory not found for variant {item.VariantId}.");

                var availableStock = inventory.AvailableStock - inventory.ReservedStock;

                if (availableStock < item.Quantity)
                    throw new AppException($"Insufficient stock for '{item.ProductName}'. Available: {availableStock}, Requested: {item.Quantity}");

                // Trừ tồn kho
                inventory.AvailableStock -= item.Quantity;
                inventory.SoldStock += item.Quantity;
                inventory.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // Check và auto-update product status nếu hết hàng
            foreach (var productId in productIds)
            {
                await AutoUpdateProductStockStatusAsync(productId);
            }
        }

        /// <summary>
        /// Tự động cập nhật trạng thái sản phẩm dựa trên tổng tồn kho.
        /// - Tổng stock = 0 → OUT_OF_STOCK
        /// - Tổng stock > 0 và đang OUT_OF_STOCK → ACTIVE (phục hồi)
        /// </summary>
        private async Task AutoUpdateProductStockStatusAsync(long productId)
        {
            var product = await _context.Products
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Inventory)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null) return;

            var totalAvailableStock = product.Variants
                .Where(v => v.Inventory != null)
                .Sum(v => v.Inventory!.AvailableStock - v.Inventory.ReservedStock);

            if (totalAvailableStock <= 0 && product.Status != ProductConstants.ProductStatusOutOfStock)
            {
                product.Status = ProductConstants.ProductStatusOutOfStock;
                await _context.SaveChangesAsync();
            }
            else if (totalAvailableStock > 0 && product.Status == ProductConstants.ProductStatusOutOfStock)
            {
                // Phục hồi trạng thái nếu có hàng trở lại
                product.Status = ProductConstants.ProductStatusActive;
                await _context.SaveChangesAsync();
            }
        }

        // ═══════════════════════════════════════════════════════
        // Helper Methods
        // ═══════════════════════════════════════════════════════

        private async Task<UserAddresses> GetUserAddressAsync(string userId, long addressId)
        {
            var address = await _context.UserAddressesEnumerable.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
            if (address == null)
            {
                throw new AppException("Address does not belong to the current user.", 404);
            }
            return address;
        }

        /// <summary>
        /// Lấy và validate các item được chọn từ giỏ hàng.
        /// Include Inventory để kiểm tra tồn kho.
        /// </summary>
        private async Task<List<CheckoutSourceItem>> GetSelectedCartItemsAsync(string userId, List<long> cartItemIds)
        {
            if (cartItemIds == null || cartItemIds.Count == 0)
            {
                throw new AppException("Please select at least one cart item.");
            }

            var items = await _context.CartItems
                .Include(ci => ci.Product).ThenInclude(p => p.Shop)
                .Include(ci => ci.Variant)
                    .ThenInclude(v => v.Inventory)
                .Include(ci => ci.Variant)
                    .ThenInclude(v => v.VariantAttributes)
                        .ThenInclude(va => va.AttributeValue)
                            .ThenInclude(av => av.AttributeType)
                .Include(ci => ci.Cart)
                .Where(ci => ci.Cart.UserId == userId && cartItemIds.Contains(ci.Id))
                .ToListAsync();

            if (items.Count != cartItemIds.Distinct().Count())
            {
                throw new AppException("One or more selected cart items are invalid.");
            }

            return items.Select(MapCartItemToSource).ToList();
        }

        /// <summary>
        /// Xây dựng thông tin item cho hình thức "Mua ngay".
        /// </summary>
        private async Task<CheckoutSourceItem> BuildBuyNowItemAsync(BuyNowRequest request)
        {
            if (request.Quantity <= 0)
            {
                throw new AppException("Quantity must be greater than 0.");
            }

            var product = await _context.Products
                .Include(p => p.Shop)
                .FirstOrDefaultAsync(p => p.ProductId == request.ProductId);

            if (product == null)
            {
                throw new AppException("Product does not exist.", 404);
            }

            // Không cho đặt hàng nếu sản phẩm đã hết hàng
            if (product.Status == ProductConstants.ProductStatusOutOfStock)
            {
                throw new AppException("This product is out of stock.");
            }

            ProductVariant? variant = null;
            if (request.VariantId.HasValue)
            {
                variant = await _context.ProductVariants
                    .Include(v => v.Inventory)
                    .Include(v => v.VariantAttributes)
                        .ThenInclude(va => va.AttributeValue)
                            .ThenInclude(av => av.AttributeType)
                    .FirstOrDefaultAsync(v => v.VariantId == request.VariantId.Value && v.ProductId == request.ProductId);

                if (variant == null) throw new AppException("Variant does not exist.", 404);

                ValidateInventoryStock(variant, request.Quantity);
            }

            return BuildSourceItem(product, variant, request.Quantity, null);
        }

        private CheckoutSourceItem MapCartItemToSource(CartItem cartItem)
        {
            // Check product status
            if (cartItem.Product.Status == ProductConstants.ProductStatusOutOfStock)
            {
                throw new AppException($"Product '{cartItem.Product.Name}' is out of stock.");
            }

            ValidateStock(cartItem.Product, cartItem.Variant, cartItem.Quantity);
            return BuildSourceItem(cartItem.Product, cartItem.Variant, cartItem.Quantity, cartItem);
        }

        /// <summary>
        /// Chuyển đổi Product/Variant sang cấu trúc CheckoutSourceItem dùng chung cho việc tính toán.
        /// </summary>
        private CheckoutSourceItem BuildSourceItem(Product product, ProductVariant? variant, int quantity, CartItem? cartItem)
        {
            var unitPrice = GetUnitPrice(product, variant);

            var variantName = string.Empty;
            var variantValue = string.Empty;

            if (variant?.VariantAttributes != null && variant.VariantAttributes.Any())
            {
                variantName = string.Join(", ", variant.VariantAttributes.Select(va => va.AttributeValue?.AttributeType?.Name ?? ""));
                variantValue = string.Join(", ", variant.VariantAttributes.Select(va => va.AttributeValue?.Value ?? ""));
            }

            return new CheckoutSourceItem
            {
                CartItem = cartItem,
                ProductId = product.ProductId,
                ShopId = product.ShopId,
                VariantId = variant?.VariantId,
                ProductName = product.Name,
                ProductImage = product.Image,
                VariantName = variantName,
                VariantValue = variantValue,
                UnitPrice = unitPrice,
                Quantity = quantity,
                LineTotal = unitPrice * quantity
            };
        }

        /// <summary>
        /// Tính toán toàn bộ chi phí: Tạm tính, Phí ship, Giảm giá và Tổng cuối.
        /// </summary>
        private async Task<CheckoutPricingResult> BuildPricingAsync(List<CheckoutSourceItem> sourceItems, List<string> voucherCodes)
        {
            if (sourceItems.Count == 0)
            {
                throw new AppException("There are no items to checkout.");
            }

            var subtotal = sourceItems.Sum(item => item.LineTotal);
            var shippingFee = CalculateShippingFee(sourceItems);
            var vouchers = await LoadValidVouchersAsync(voucherCodes);
            var discountAmount = CalculateDiscountAmount(subtotal, vouchers);
            var finalAmount = Math.Max(0, subtotal + shippingFee - discountAmount);

            return new CheckoutPricingResult
            {
                Items = sourceItems.Select(item => new CheckoutItemDto {
                    // Map sang DTO để trả về Client
                    ProductId = item.ProductId,
                    ShopId = item.ShopId,
                    VariantId = item.VariantId,
                    ProductName = item.ProductName,
                    ProductImage = item.ProductImage,
                    VariantName = item.VariantName,
                    VariantValue = item.VariantValue,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                    LineTotal = item.LineTotal
                }).ToList(),
                Vouchers = vouchers,
                SourceItems = sourceItems,
                MerchandiseSubtotal = subtotal,
                ShippingFee = shippingFee,
                DiscountAmount = discountAmount,
                FinalAmount = finalAmount
            };
        }

        private CheckoutPreviewResponse BuildPreviewResponse(string checkoutType, string paymentMethod, UserAddresses address, CheckoutPricingResult pricing)
        {
            return new CheckoutPreviewResponse
            {
                CheckoutType = checkoutType,
                PaymentMethod = paymentMethod,
                Address = address != null ? new CheckoutAddressDto
                {
                    Id = address.Id,
                    FullName = address.FullName,
                    PhoneNumber = address.PhoneNumber.ToString(),
                    City = address.City,
                    StreetName = address.StreetName,
                    HouseNo = address.HouseNo,
                    IsDefault = address.IsDefault
                } : null,
                Items = pricing.Items,
                AppliedVoucherCodes = pricing.Vouchers.Select(v => v.Code).ToList(),
                MerchandiseSubtotal = pricing.MerchandiseSubtotal,
                ShippingFee = pricing.ShippingFee,
                DiscountAmount = pricing.DiscountAmount,
                FinalAmount = pricing.FinalAmount
            };
        }

        /// <summary>
        /// Khởi tạo và lưu đơn hàng vào Database cùng các thông tin liên quan (Item, Voucher, Transaction).
        /// </summary>
        private async Task<Order> CreateOrderAsync(string userId, UserAddresses address, string paymentMethod, CheckoutPricingResult pricing)
        {
            var createdAt = DateTime.UtcNow;
            var order = new Order
            {
                CustomerId = userId,
                AddressId = address.Id,
                PaymentMethod = paymentMethod,
                PaymentStatus = "pending",
                Status = "pending",
                MerchandiseSubtotal = pricing.MerchandiseSubtotal,
                ShippingFee = pricing.ShippingFee,
                DiscountAmount = pricing.DiscountAmount,
                FinalAmount = pricing.FinalAmount,
                Create_At = createdAt,
                OrderItems = new List<OrderItem>(),
                OrderVouchers = new List<OrderVoucher>(),
                OrderTrackings = new List<OrderTracking>
                {
                    new OrderTracking
                    {
                        Status = "pending",
                        Description = "Your order has been placed successfully.",
                        UpdatedBy = "system",
                        CreatedAt = createdAt
                    }
                },
                ShippingDetail = new ShippingDetail
                {
                    Status = "pending",
                    UpdatedAt = createdAt
                }
            };

            // Lưu danh sách sản phẩm trong đơn hàng
            foreach (var item in pricing.SourceItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    ShopId = item.ShopId,
                    ProductId = item.ProductId,
                    VariantId = item.VariantId,
                    ProductName = item.ProductName,
                    ProductImage = item.ProductImage,
                    VariantName = item.VariantName,
                    VariantValue = item.VariantValue,
                    Price = item.UnitPrice,
                    Quantity = item.Quantity
                });
            }

            // Lưu vết các Voucher đã áp dụng
            foreach (var voucher in pricing.Vouchers)
            {
                order.OrderVouchers.Add(new OrderVoucher { VoucherId = voucher.Id });
            }

            // Khởi tạo giao dịch thanh toán
            order.PaymentTransaction = new PaymentTransaction
            {
                Method = paymentMethod,
                Status = "pending"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ của danh sách mã Voucher người dùng nhập vào.
        /// </summary>
        private async Task<List<Voucher>> LoadValidVouchersAsync(List<string> voucherCodes)
        {
            if (voucherCodes == null || voucherCodes.Count == 0) return new List<Voucher>();

            var normalizedCodes = voucherCodes
                .Where(code => !string.IsNullOrWhiteSpace(code))
                .Select(code => code.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (normalizedCodes.Count == 0) return new List<Voucher>();

            var vouchers = await _context.Vouchers
                .Where(v => normalizedCodes.Contains(v.Code) && v.IsActive)
                .ToListAsync();

            if (vouchers.Count != normalizedCodes.Count)
            {
                throw new AppException("One or more voucher codes are invalid.");
            }

            var now = DateTime.UtcNow;
            var expiredVoucher = vouchers.FirstOrDefault(v => v.ExpiredAt.HasValue && v.ExpiredAt.Value < now);
            if (expiredVoucher != null)
            {
                throw new AppException($"Voucher '{expiredVoucher.Code}' has expired.");
            }

            return vouchers;
        }

        /// <summary>
        /// Tính toán tổng số tiền giảm giá dựa trên loại Voucher (Phần trăm hoặc Số tiền cố định).
        /// </summary>
        private decimal CalculateDiscountAmount(decimal subtotal, List<Voucher> vouchers)
        {
            decimal discountAmount = 0;

            foreach (var voucher in vouchers)
            {
                if (voucher.MinOrderValue.HasValue && subtotal < (decimal)voucher.MinOrderValue.Value)
                {
                    throw new AppException($"Voucher '{voucher.Code}' requires a higher order value.");
                }

                decimal voucherDiscount = voucher.DiscountType.ToLowerInvariant() switch
                {
                    "percent" or "percentage" => subtotal * ((decimal)voucher.Value / 100m),
                    "fixed" => (decimal)voucher.Value,
                    _ => throw new AppException($"Voucher '{voucher.Code}' has unsupported discount type.")
                };

                // Áp dụng mức giảm tối đa nếu có
                if (voucher.MaxDiscount.HasValue)
                {
                    voucherDiscount = Math.Min(voucherDiscount, (decimal)voucher.MaxDiscount.Value);
                }

                discountAmount += voucherDiscount;
            }

            return Math.Min(discountAmount, subtotal); // Không cho phép giảm quá tổng tiền
        }

        /// <summary>
        /// Tính phí vận chuyển (Tạm tính: 22k cho mỗi Shop khác nhau).
        /// </summary>
        private decimal CalculateShippingFee(List<CheckoutSourceItem> items)
        {
            var uniqueShopCount = items.Select(item => item.ShopId).Distinct().Count();
            return uniqueShopCount * 22000m;
        }

        /// <summary>
        /// Lấy giá đơn vị sau khi cộng chênh lệch của Variant (nếu có).
        /// </summary>
        private decimal GetUnitPrice(Product product, ProductVariant? variant)
        {
            var productPrice = product.DiscountPrice ?? product.Price;
            var finalPrice = variant?.Price ?? productPrice;

            return finalPrice;
        }

        /// <summary>
        /// Kiểm tra số lượng tồn kho từ Inventory.
        /// </summary>
        private void ValidateStock(Product product, ProductVariant? variant, int quantity)
        {
            if (variant != null)
            {
                ValidateInventoryStock(variant, quantity);
                return;
            }
        }

        /// <summary>
        /// Kiểm tra stock từ Inventory table (nguồn truth duy nhất).
        /// </summary>
        private void ValidateInventoryStock(ProductVariant variant, int quantity)
        {
            var inventory = variant.Inventory;

            if (inventory == null)
                throw new AppException($"Inventory not found for variant {variant.VariantId}.");

            var available = inventory.AvailableStock - inventory.ReservedStock;

            if (available < quantity)
                throw new AppException($"Insufficient stock. Available: {available}, Requested: {quantity}");
        }

        private void ValidatePaymentMethod(string paymentMethod)
        {
            if (string.IsNullOrWhiteSpace(paymentMethod) || !string.Equals(paymentMethod, CodPaymentMethod, StringComparison.OrdinalIgnoreCase))
            {
                throw new AppException("Only COD payment is supported at the moment.");
            }
        }

        /// <summary>
        /// Class nội bộ dùng để đồng nhất dữ liệu từ Giỏ hàng hoặc Mua ngay trước khi tính toán.
        /// </summary>
        private class CheckoutSourceItem
        {
            public CartItem? CartItem { get; set; }
            public long ProductId { get; set; }
            public long ShopId { get; set; }
            public long? VariantId { get; set; }
            public string ProductName { get; set; }
            public string? ProductImage { get; set; }
            public string? VariantName { get; set; }
            public string? VariantValue { get; set; }
            public decimal UnitPrice { get; set; }
            public int Quantity { get; set; }
            public decimal LineTotal { get; set; }
        }

        /// <summary>
        /// Kết quả tính toán giá cuối cùng.
        /// </summary>
        private class CheckoutPricingResult
        {
            public List<CheckoutItemDto> Items { get; set; } = new();
            public List<Voucher> Vouchers { get; set; } = new();
            public List<CheckoutSourceItem> SourceItems { get; set; } = new();
            public decimal MerchandiseSubtotal { get; set; }
            public decimal ShippingFee { get; set; }
            public decimal DiscountAmount { get; set; }
            public decimal FinalAmount { get; set; }
        }
    }
}