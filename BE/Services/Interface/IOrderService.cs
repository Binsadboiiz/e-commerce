using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IOrderService
    {
        Task<List<CheckoutAddressDto>> GetUserAddressesAsync(string userId);
        Task<CheckoutPreviewResponse> PreviewCartCheckoutAsync(string userId, CheckoutPreviewRequest request);
        Task<PlaceOrderResponse> PlaceCartOrderAsync(string userId, CheckoutPlaceOrderRequest request);
        Task<CheckoutPreviewResponse> PreviewBuyNowAsync(string userId, BuyNowRequest request);
        Task<PlaceOrderResponse> PlaceBuyNowOrderAsync(string userId, BuyNowRequest request);
    }
}