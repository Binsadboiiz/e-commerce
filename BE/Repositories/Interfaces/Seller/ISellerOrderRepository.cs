using BE.Models.Entities;

namespace BE.Repositories.Interfaces.Seller
{
    public interface ISellerOrderRepository
    {
        Task<List<long>> GetSellerShopIdsAsync(string userId);
        Task<List<Order>> GetOrdersAsync(List<long> shopIds, string? status, int page, int pageSize);
        Task<int> CountOrdersAsync(List<long> shopIds, string? status);
        Task<Order?> GetOrderDetailAsync(long orderId, List<long> shopIds);
        Task<Order?> GetOrderForUpdateAsync(long orderId, List<long> shopIds);
        Task<List<OrderItem>> GetSellerOrderItemsAsync(long orderId, List<long> shopIds);
        Task<List<OrderTracking>> GetOrderTrackingAsync(long orderId, List<long> shopIds);
        Task AddTrackingAsync(OrderTracking tracking);
        Task SaveChangesAsync();
    }
}