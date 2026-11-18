using System.Threading.Tasks;
using BE.Models.DTOs.Seller.Dashboard;

namespace BE.Services.Interface.Seller
{
    /// <summary>
    /// Service interface for processing and calculating seller-specific dashboard metrics and charts.
    /// </summary>
    public interface ISellerDashboardService
    {
        /// <summary>
        /// Retrieves the computed dashboard metrics, trend data, category sales, and recent orders for a specific seller.
        /// </summary>
        /// <param name="userId">The application user ID of the seller/owner.</param>
        /// <param name="timeRange">The period range for query stats (e.g. "today", "7d", "30d", "ytd").</param>
        /// <returns>A DTO containing dashboard aggregates, trends, and recent orders.</returns>
        Task<SellerDashboardDto> GetDashboardDataAsync(string userId, string timeRange);
    }
}
