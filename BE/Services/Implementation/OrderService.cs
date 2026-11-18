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
                CategoryId = product.CategoryId,
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
            var discountAmount = CalculateDiscountAmount(sourceItems, subtotal, shippingFee, vouchers, out decimal shippingDiscount);
            var totalDiscount = discountAmount + shippingDiscount;
            var finalAmount = Math.Max(0, subtotal + shippingFee - totalDiscount);

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
                DiscountAmount = totalDiscount,
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
        /// Initialize and save the order to the Database along with related details (Item, Voucher, Transaction).
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

            // Save products in the order
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

            // Record the applied Vouchers
            foreach (var voucher in pricing.Vouchers)
            {
                order.OrderVouchers.Add(new OrderVoucher { VoucherId = voucher.Id });
                voucher.UsageCount++; // Increment the voucher usage count
            }

            // Initialize payment transaction
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
        /// Verify validity of the list of voucher codes entered by the user.
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

            var limitReachedVoucher = vouchers.FirstOrDefault(v => v.UsageLimit.HasValue && v.UsageCount >= v.UsageLimit.Value);
            if (limitReachedVoucher != null)
            {
                throw new AppException($"Voucher '{limitReachedVoucher.Code}' usage limit has been reached.");
            }

            return vouchers;
        }

        /// <summary>
        /// Calculate total discount amount based on Voucher type (Percentage or Fixed amount).
        /// </summary>
        private decimal CalculateDiscountAmount(
            List<CheckoutSourceItem> sourceItems,
            decimal subtotal,
            decimal shippingFee,
            List<Voucher> vouchers,
            out decimal shippingDiscount)
        {
            decimal merchandiseDiscount = 0;
            shippingDiscount = 0;

            foreach (var voucher in vouchers)
            {
                decimal applicableSubtotal = 0;
                if (voucher.VoucherType == "Shipping")
                {
                    applicableSubtotal = subtotal;
                }
                else
                {
                    // Filter products applicable for the voucher: by ShopId (if seller voucher) and CategoryId (if category type voucher)
                    var items = sourceItems.AsEnumerable();
                    if (voucher.ShopId.HasValue)
                    {
                        items = items.Where(i => i.ShopId == voucher.ShopId.Value);
                    }
                    if (voucher.VoucherType == "Category" && voucher.CategoryId.HasValue)
                    {
                        items = items.Where(i => i.CategoryId == voucher.CategoryId.Value);
                    }
                    applicableSubtotal = items.Sum(i => i.LineTotal);
                }

                // If no items are valid to apply the voucher (except shipping vouchers)
                if (applicableSubtotal <= 0 && voucher.VoucherType != "Shipping")
                {
                    throw new AppException($"Voucher '{voucher.Code}' is not applicable to any items in your checkout.");
                }

                // Check minimum order value condition
                if (voucher.MinOrderValue.HasValue && applicableSubtotal < (decimal)voucher.MinOrderValue.Value)
                {
                    throw new AppException($"Voucher '{voucher.Code}' requires a minimum order value of {voucher.MinOrderValue.Value:N0} VND.");
                }

                if (voucher.VoucherType == "Shipping")
                {
                    decimal maxShippingToDiscount = shippingFee;
                    if (voucher.ShopId.HasValue)
                    {
                        var hasItemsFromShop = sourceItems.Any(i => i.ShopId == voucher.ShopId.Value);
                        if (!hasItemsFromShop)
                        {
                            throw new AppException($"Voucher '{voucher.Code}' is only applicable for shop shipping fee.");
                        }
                        maxShippingToDiscount = 22000m; // Default shop shipping fee
                    }

                    decimal discountValue = voucher.DiscountType.ToLowerInvariant() switch
                    {
                        "percent" or "percentage" => shippingFee * ((decimal)voucher.Value / 100m),
                        "fixed" => (decimal)voucher.Value,
                        _ => throw new AppException($"Voucher '{voucher.Code}' has unsupported discount type.")
                    };

                    if (voucher.MaxDiscount.HasValue)
                    {
                        discountValue = Math.Min(discountValue, (decimal)voucher.MaxDiscount.Value);
                    }

                    shippingDiscount += Math.Min(discountValue, maxShippingToDiscount);
                }
                else
                {
                    decimal discountValue = voucher.DiscountType.ToLowerInvariant() switch
                    {
                        "percent" or "percentage" => applicableSubtotal * ((decimal)voucher.Value / 100m),
                        "fixed" => (decimal)voucher.Value,
                        _ => throw new AppException($"Voucher '{voucher.Code}' has unsupported discount type.")
                    };

                    if (voucher.MaxDiscount.HasValue)
                    {
                        discountValue = Math.Min(discountValue, (decimal)voucher.MaxDiscount.Value);
                    }

                    merchandiseDiscount += Math.Min(discountValue, applicableSubtotal);
                }
            }

            shippingDiscount = Math.Min(shippingDiscount, shippingFee);
            merchandiseDiscount = Math.Min(merchandiseDiscount, subtotal);

            return merchandiseDiscount;
        }

        /// <summary>
        /// Calculate shipping fee (Estimated: 22k VND for each unique Shop).
        /// </summary>
        private decimal CalculateShippingFee(List<CheckoutSourceItem> items)
        {
            var uniqueShopCount = items.Select(item => item.ShopId).Distinct().Count();
            return uniqueShopCount * 22000m;
        }

        /// <summary>
        /// Get unit price after adding Variant price adjustments (if any).
        /// </summary>
        private decimal GetUnitPrice(Product product, ProductVariant? variant)
        {
            var productPrice = product.DiscountPrice ?? product.Price;
            var finalPrice = variant?.Price ?? productPrice;

            return finalPrice;
        }

        /// <summary>
        /// Verify inventory stock availability.
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
        /// Verify stock from the Inventory table (the single source of truth).
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
        /// Internal class used to consolidate checkout source item properties from Cart or Buy Now before evaluation.
        /// </summary>
        private class CheckoutSourceItem
        {
            public CartItem? CartItem { get; set; }
            public long ProductId { get; set; }
            public long ShopId { get; set; }
            public long CategoryId { get; set; }
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
        /// Final price calculation results.
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

        public async Task<List<BE.Models.DTOs.Seller.VoucherApplicableDto>> GetApplicableVouchersAsync(string userId, GetVouchersRequest request)
        {
            List<CheckoutSourceItem> sourceItems = new();
            if (request.CartItemIds != null && request.CartItemIds.Count > 0)
            {
                sourceItems = await GetSelectedCartItemsAsync(userId, request.CartItemIds);
            }
            else if (request.BuyNowProductId.HasValue && request.BuyNowQuantity.HasValue)
            {
                var buyNowRequest = new BuyNowRequest
                {
                    ProductId = request.BuyNowProductId.Value,
                    VariantId = request.BuyNowVariantId,
                    Quantity = request.BuyNowQuantity.Value
                };
                var buyNowItem = await BuildBuyNowItemAsync(buyNowRequest);
                sourceItems.Add(buyNowItem);
            }

            if (sourceItems.Count == 0)
            {
                return new List<BE.Models.DTOs.Seller.VoucherApplicableDto>();
            }

            var shopIds = sourceItems.Select(i => i.ShopId).Distinct().ToList();
            var categoryIds = sourceItems.Select(i => i.CategoryId).Distinct().ToList();
            var subtotal = sourceItems.Sum(item => item.LineTotal);
            var shippingFee = CalculateShippingFee(sourceItems);

            // Get all active and unexpired vouchers: platform-wide or belonging to Shops with products in the order
            var now = DateTime.UtcNow;
            var vouchers = await _context.Vouchers
                .Include(v => v.Category)
                .Include(v => v.Shop)
                .Where(v => v.IsActive && (!v.ExpiredAt.HasValue || v.ExpiredAt.Value > now))
                .Where(v => !v.ShopId.HasValue || shopIds.Contains(v.ShopId.Value))
                .ToListAsync();

            var result = new List<BE.Models.DTOs.Seller.VoucherApplicableDto>();

            foreach (var voucher in vouchers)
            {
                var dto = new BE.Models.DTOs.Seller.VoucherApplicableDto
                {
                    Id = voucher.Id,
                    Code = voucher.Code,
                    DiscountType = voucher.DiscountType,
                    Value = voucher.Value,
                    MaxDiscount = voucher.MaxDiscount,
                    MinOrderValue = voucher.MinOrderValue,
                    ExpiredAt = voucher.ExpiredAt,
                    VoucherType = voucher.VoucherType,
                    CategoryId = voucher.CategoryId,
                    CategoryName = voucher.Category?.Type,
                    ShopId = voucher.ShopId,
                    ShopName = voucher.Shop?.Name,
                    UsageLimit = voucher.UsageLimit,
                    UsageCount = voucher.UsageCount,
                    IsApplicable = true
                };

                // Check usage limit constraint
                if (voucher.UsageLimit.HasValue && voucher.UsageCount >= voucher.UsageLimit.Value)
                {
                    dto.IsApplicable = false;
                    dto.Reason = "Voucher usage limit has been reached.";
                }
                // Check matching product categories
                else if (voucher.VoucherType == "Category" && voucher.CategoryId.HasValue && !categoryIds.Contains(voucher.CategoryId.Value))
                {
                    dto.IsApplicable = false;
                    dto.Reason = $"Only applicable to products in the category '{voucher.Category?.Type}'.";
                }
                // Check minimum order value condition
                else
                {
                    decimal applicableSubtotal = 0;
                    if (voucher.VoucherType == "Shipping")
                    {
                        applicableSubtotal = subtotal;
                    }
                    else
                    {
                        var items = sourceItems.AsEnumerable();
                        if (voucher.ShopId.HasValue)
                        {
                            items = items.Where(i => i.ShopId == voucher.ShopId.Value);
                        }
                        if (voucher.VoucherType == "Category" && voucher.CategoryId.HasValue)
                        {
                            items = items.Where(i => i.CategoryId == voucher.CategoryId.Value);
                        }
                        applicableSubtotal = items.Sum(i => i.LineTotal);
                    }

                    if (applicableSubtotal <= 0)
                    {
                        dto.IsApplicable = false;
                        dto.Reason = "No items match the voucher criteria.";
                    }
                    else if (voucher.MinOrderValue.HasValue && applicableSubtotal < (decimal)voucher.MinOrderValue.Value)
                    {
                        dto.IsApplicable = false;
                        dto.Reason = $"Minimum order value of {voucher.MinOrderValue.Value:N0} VND not reached.";
                    }
                }

                result.Add(dto);
            }

            return result.OrderByDescending(r => r.IsApplicable).ThenByDescending(r => r.Value).ToList();
        }
    }
}