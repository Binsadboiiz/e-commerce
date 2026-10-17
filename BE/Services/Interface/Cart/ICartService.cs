using BE.Models.DTOs;

namespace BE.Services.Interface.Cart
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
