using BE.Constants;
using BE.Data;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Middlewares;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ── Get or create cart, return DTO grouped by shop ──
        public async Task<CartResponse> GetCart(string userId)
        {
            var cart = await GetOrCreateCart(userId);

            return MapToResponse(cart);
        }

        // ── Add product to cart ──
        public async Task<CartResponse> AddToCart(string userId, AddToCartRequest request)
        {
            if (string.IsNullOrEmpty(userId))
                throw new AppException("Invalid user!");

            if (request.Quantity <= 0)
                throw new AppException("Quantity must be greater than 0.");

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
                throw new AppException("Product does not exist.");

            // Không cho thêm vào giỏ nếu sản phẩm đã hết hàng
            if (product.Status == ProductConstants.ProductStatusOutOfStock)
                throw new AppException("This product is out of stock.");

            // Check stock (variant is required)
            if (!request.VariantId.HasValue)
                throw new AppException("Variant is required.");

            var variant = await _context.ProductVariants
                .Include(v => v.Inventory)
                .FirstOrDefaultAsync(v =>
                    v.VariantId == request.VariantId.Value &&
                    v.ProductId == request.ProductId);

            if (variant == null)
                throw new AppException("Invalid variant.");

            // Check stock từ Inventory (nguồn truth duy nhất)
            if (variant.Inventory == null)
                throw new AppException("Inventory not found for this variant.");

            var available = variant.Inventory.AvailableStock - variant.Inventory.ReservedStock;

            if (available < request.Quantity)
                throw new AppException($"Insufficient stock. Available: {available}");


            var cart = await GetOrCreateCart(userId);

            // Check if item already exists (same product + same variant)
            var existingItem = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == request.ProductId
                                   && ci.VariantId == request.VariantId);

            if (existingItem != null)
            {
                // Kiểm tra tổng số lượng sau khi cộng thêm
                var newTotal = existingItem.Quantity + request.Quantity;
                if (newTotal > available)
                    throw new AppException($"Cannot add more. Available: {available}, Current in cart: {existingItem.Quantity}");

                existingItem.Quantity = newTotal;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = request.ProductId,
                    VariantId = request.VariantId,
                    Quantity = request.Quantity
                });
            }

            await _context.SaveChangesAsync();

            _context.ChangeTracker.Clear();

            // Re-fetch with includes to build response
            cart = await GetOrCreateCart(userId);
            return MapToResponse(cart);
        }

        // ── Update quantity ──
        public async Task<CartResponse> UpdateQuantity(string userId, UpdateCartRequest request)
        {
            var cart = await GetOrCreateCart(userId);

            var item = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == request.ProductId
                                   && ci.VariantId == request.VariantId);

            if (item == null)
                throw new AppException("Item not found in cart.");

            if (request.Quantity <= 0)
            {
                _context.CartItems.Remove(item);
            }
            else
            {
                // Check stock khi tăng số lượng
                if (item.Variant?.Inventory != null)
                {
                    var available = item.Variant.Inventory.AvailableStock - item.Variant.Inventory.ReservedStock;
                    if (request.Quantity > available)
                        throw new AppException($"Insufficient stock. Available: {available}");
                }

                item.Quantity = request.Quantity;
            }

            await _context.SaveChangesAsync();

            cart = await GetOrCreateCart(userId);
            return MapToResponse(cart);
        }

        // ── Remove item ──
        public async Task RemoveItem(string userId, long productId, long? variantId)
        {
            var cart = await GetOrCreateCart(userId);

            var item = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == productId
                                   && ci.VariantId == variantId);

            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        // ── Clear cart ──
        public async Task ClearCart(string userId)
        {
            var cart = await GetOrCreateCart(userId);

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();
        }

        // ═══════════════════════════════════════════════════════
        // Private helpers
        // ═══════════════════════════════════════════════════════

        private async Task<Cart> GetOrCreateCart(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.Shop)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Variant)
                        .ThenInclude(v => v.Inventory)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Variant)
                        .ThenInclude(v => v.VariantAttributes)
                            .ThenInclude(va => va.AttributeValue)
                                .ThenInclude(av => av.AttributeType)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                // Verify user exists before creating cart
                var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
                if (!userExists)
                    throw new AppException($"User '{userId}' does not exist.");

                cart = new Cart
                {
                    UserId = userId,
                    Create_At = DateTime.UtcNow,
                    CartItems = new List<CartItem>()
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        private CartResponse MapToResponse(Cart cart)
        {
            var groups = cart.CartItems
                .Where(ci => ci.Product != null && ci.Product.Shop != null)
                .GroupBy(ci => ci.Product.Shop)
                .Select(g => new CartShopGroup
                {
                    ShopId = g.Key.ShopId,
                    ShopName = g.Key.Name,
                    ShopLogo = g.Key.Logo,
                    Items = g.Select(ci =>
                    {

                        // Use variant price if available, otherwise fallback to product price
                        decimal basePrice = ci.Variant?.Price ?? ci.Product.Price;
                        decimal? discountPrice = ci.Product.DiscountPrice;
                        decimal effectivePrice = discountPrice ?? basePrice;

                        // Stock từ Inventory
                        var availableStock = ci.Variant?.Inventory != null
                            ? ci.Variant.Inventory.AvailableStock - ci.Variant.Inventory.ReservedStock
                            : 0;

                        // Build variant name and value (e.g., "Color: Red, Size: XL")
                        var variantName = string.Empty;
                        var variantValue = string.Empty;

                        if (ci.Variant?.VariantAttributes != null && ci.Variant.VariantAttributes.Any())
                        {
                            variantName = string.Join(", ", ci.Variant.VariantAttributes.Select(va => va.AttributeValue?.AttributeType?.Name ?? ""));
                            variantValue = string.Join(", ", ci.Variant.VariantAttributes.Select(va => va.AttributeValue?.Value ?? ""));
                        }

                        return new CartItemResponse
                        {
                            CartItemId = ci.Id,
                            ProductId = ci.ProductId,
                            ProductName = ci.Product.Name,
                            ProductImage = ci.Product.Image,
                            Price = basePrice,
                            DiscountPrice = discountPrice,
                            Quantity = ci.Quantity,
                            Stock = availableStock,
                            SubTotal = effectivePrice * ci.Quantity,
                            VariantId = ci.VariantId,
                            VariantName = variantName,
                            VariantValue = variantValue
                        };
                    }).ToList()
                }).ToList();

            return new CartResponse
            {
                CartId = cart.CartId,
                TotalItems = cart.CartItems.Count,
                TotalPrice = groups.SelectMany(g => g.Items).Sum(i => i.SubTotal),
                ShopGroups = groups
            };
        }
    }
}
