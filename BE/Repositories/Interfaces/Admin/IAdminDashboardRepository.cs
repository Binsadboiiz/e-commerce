using BE.Models.Entities;

namespace BE.Repositories.Interfaces.Admin
{
    public interface IAdminDashboardRepository
    {
        Task<User?> GetAdminAsync(string userId);
        Task<int> GetPendingSellerApplicationsAsync();
        Task<int> GetPendingShopApplicationsAsync();
    }
}
