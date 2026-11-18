using System.Collections.Generic;
using System.Threading.Tasks;
using BE.Models.DTOs.Admin.Dashboard;
using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Admin
{
    /// <summary>
    /// Service interface dedicated to managing seller onboarding applications.
    /// Handles application listing, detail retrieval, review flow, approval, and rejection.
    /// </summary>
    public interface IAdminSellerApplicationService
    {
        Task<List<AdminSellerApplicationDto>> GetSellerApplicationsAsync();
        Task<SellerRegistrationDto?> GetSellerApplicationDetailAsync(string sellerId);
        Task<bool> StartReviewSellerApplicationAsync(string id, string? adminUserId = null);
        Task<bool> ApproveSellerApplicationAsync(string id);
        Task<bool> RejectSellerApplicationAsync(string id, string? reason = null);
    }
}
