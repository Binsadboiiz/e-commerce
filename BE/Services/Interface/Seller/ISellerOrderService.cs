using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Seller
{
    public interface ISellerOrderService
    {
        Task<(List<SellerOrderListDto> Items, int Total)> GetOrdersAsync(
            string userId, string? status, int page, int pageSize);

        Task<SellerOrderDetailDto?> GetOrderDetailAsync(long orderId, string userId);

        Task UpdateOrderStatusAsync(long orderId, string userId, UpdateSellerOrderStatusRequest request);
    }
}
