using BE.Models.DTOs.Admin.Dashboard;
using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Admin
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardDto> GetDashboardAsync(string id);
        Task<AdminDashboardOverviewDto> GetOverviewAsync();
        Task<List<AdminSellerApplicationDto>> GetSellerApplicationsAsync();
        Task<SellerRegistrationDto?> GetSellerApplicationDetailAsync(string sellerId);
        Task<bool> ApproveSellerApplicationAsync(string id);
        Task<bool> RejectSellerApplicationAsync(string id);
    }
}
