using BE.Data;
using BE.Models.Entities;
using BE.Repositories.Interfaces.Admin;
using Microsoft.EntityFrameworkCore;

namespace BE.Repositories.Implementations.Admin
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardRepository(ApplicationDbContext context) {
            _context = context;
        }

        public async Task<User?> GetAdminAsync(string userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public Task<int> GetPendingSellerApplicationsAsync()
        {
            return Task.FromResult(0);
        }

        public Task<int> GetPendingShopApplicationsAsync()
        {
            return Task.FromResult(0);
        }
    }
}
