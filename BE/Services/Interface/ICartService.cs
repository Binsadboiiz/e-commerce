using BE.Models.Entities;

namespace BE.Services.Interface
{
    public interface ICartService
    {
        Task<Cart> GetCart(string userId);
        Task AddToCart(string userId, long productId, int quantity);
        Task UpdateQuantity(string userId, long productId, int quantity);
        Task RemoveItem(string userId, long productId);
        Task ClearCart(string userId);
    }
}