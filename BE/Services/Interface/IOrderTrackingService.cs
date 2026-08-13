using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IOrderTrackingService
    {
        /// <summary>Get full tracking details for a single order (timeline, shipping, summary).</summary>
        Task<OrderTrackingResponse> GetOrderTrackingAsync(long orderId, string userId);

        /// <summary>Get all orders belonging to a user (for "My Orders" page).</summary>
        Task<List<MyOrderDto>> GetUserOrderAsync(string userId);

        /// <summary>Update order status and auto-create a tracking event (shop / admin).</summary>
        Task UpdateOrderStatusAsync(long orderId, UpdateTrackingStatusRequest request);
    }
}