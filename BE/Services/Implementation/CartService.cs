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

            // Check stock (either variant stock or product stock)
            if (!request.VariantId.HasValue)
                throw new AppException("Variant is required.");

            var variant = await _context.ProductVariants
                .FirstOrDefaultAsync(v =>
                    v.VariantId == request.VariantId.Value &&
                    v.ProductId == request.ProductId);

            if (variant == null)
                throw new AppException("Invalid variant.");

            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.ProductVariantId == variant.VariantId);

            if (inventory == null)
                throw new AppException("Inventory not found.");

            var available = inventory.AvailableStock - inventory.ReservedStock;

            if (available < request.Quantity)
                throw new AppException("Insufficient stock.");


            var cart = await GetOrCreateCart(userId);

            // Check if item already exists (same product + same variant)
            var existingItem = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == request.ProductId
                                   && ci.VariantId == request.VariantId);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
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
                        decimal effectivePrice = ci.Product.DiscountPrice ?? ci.Product.Price;

                        var availableStock = ci.Variant?.Inventory != null
                            ? ci.Variant.Inventory.AvailableStock
                            - ci.Variant.Inventory.ReservedStock 
                            : 0;

                        return new CartItemResponse
                        {
                            CartItemId = ci.Id,
                            ProductId = ci.ProductId,
                            ProductName = ci.Product.Name,
                            ProductImage = ci.Product.Image,
                            Price = ci.Product.Price,
                            DiscountPrice = ci.Product.DiscountPrice,
                            Quantity = ci.Quantity,
                            Stock = availableStock,
                            SubTotal = effectivePrice * ci.Quantity,
                            VariantId = ci.VariantId
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
