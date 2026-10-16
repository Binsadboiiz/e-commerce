using System.Threading.Tasks;
using BE.Constants.Seller;
using BE.Data;
using BE.Models.DTOs.Admin.Dashboard;
using BE.Services.Interface.Admin;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Admin
{
    /// <summary>
    /// Service implementation for core Admin Dashboard analytics and system overview metrics.
    /// Keeps dashboard metrics separate from sub-domain operations like seller application approvals.
    /// </summary>
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetDashboardAsync(string id)
        {
            var account = await _context.Accounts
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.UserId == id);

            return new AdminDashboardDto
            {
                AdminName = account?.User?.FullName ?? "Admin",
                Role = account?.Role ?? "Admin"
            };
        }

        public async Task<AdminDashboardOverviewDto> GetOverviewAsync()
        {
            var pendingSellers = await _context.SellerAccounts
                .Include(x => x.SellerStatus)
                .CountAsync(x => x.SellerStatus.Code == SellerStatusConstants.Pending);

            return new AdminDashboardOverviewDto
            {
                PendingSellerApplications = pendingSellers,
                PendingShopApplications = 0
            };
        }
    }
}