using BE.Models.DTOs;
using BE.Models.Entities;

namespace BE.Services.Interface
{
    public interface ICartService
    {
        Task<CartResponse> GetCart(string userId);
        Task<CartResponse> AddToCart(string userId, AddToCartRequest request);
        Task<CartResponse> UpdateQuantity(string userId, UpdateCartRequest request);
        Task RemoveItem(string userId, long productId, long? variantId);
        Task ClearCart(string userId);
    }
}