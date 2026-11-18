using System.Threading.Tasks;
using BE.Models.DTOs.Admin.Dashboard;

namespace BE.Services.Interface.Admin
{
    /// <summary>
    /// Service interface for core Admin Dashboard analytics and system overview metrics.
    /// </summary>
    public interface IAdminDashboardService
    {
        Task<AdminDashboardDto> GetDashboardAsync(string id);
        Task<AdminDashboardOverviewDto> GetOverviewAsync();
    }
}
