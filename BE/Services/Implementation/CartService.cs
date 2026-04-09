using BE.Data;
using BE.Models.Entities;
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
        // Get the cart for a user, if it doesn't exist, create a new one
        public async Task<Cart> GetCart(string userId) 
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if(cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    Create_At = DateTime.Now,
                    CartItems = new List<CartItem>()
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }
        // Add a product to the cart, if it already exists, update the quantity
        public async Task AddToCart(string userId, long productId, int quantity)
        {
            var cart = await GetCart(userId);

            var existingItem = cart.CartItems
                 .FirstOrDefault(c => c.ProductId == productId);
            if(existingItem != null)
            {
                existingItem.Quantity += quantity;
            } else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity
                });
            }
            await _context.SaveChangesAsync();
        }

        // update the quantity of a product in the cart, if quantity is 0, remove the item
        public async Task UpdateQuantity(string userId, long productId, int quantity)
        {
            var cart = await GetCart(userId);

            var item = cart.CartItems
                .FirstOrDefault(i => i.ProductId == productId);

            if (item == null) return;

            if (quantity <= 0)
                cart.CartItems.Remove(item);
            else
                item.Quantity = quantity;

            await _context.SaveChangesAsync();
        }

        // Remove a product from the cart
        public async Task RemoveItem(string userId, long productId)
        {
            var cart = await GetCart(userId);

            var item = cart.CartItems
                .FirstOrDefault(i => i.ProductId == productId);

            if (item != null)
            {
                cart.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        // Clear the cart
        public async Task ClearCart(string userId)
        {
            var cart = await GetCart(userId);
            cart.CartItems.Clear();
            await _context.SaveChangesAsync();
        }
    }
}
