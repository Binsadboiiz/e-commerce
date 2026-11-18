using BE.Data;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE.Repositories.Implementations
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IQueryable<Review> Query()
        {
            return _context.Reviews
                .AsNoTracking()
                .Include(r => r.Images)
                .Include(r => r.Reply)
                .Include(r => r.User)
                .Where(r => !r.IsHidden);
        }

        public async Task<Review?> GetByIdAsync(long reviewId)
        {
            return await _context.Reviews
                .AsNoTracking()
                .Include(r => r.Images)
                .Include(r => r.Reply)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId);
        }

        public async Task<List<Review>> GetByProductIdAsync(long productId, int take = 10)
        {
            return await _context.Reviews
                .AsNoTracking()
                .Where(r => r.ProductId == productId && !r.IsHidden)
                .OrderByDescending(r => r.CreatedAt)
                .Take(take)
                .Include(r => r.Images)
                .Include(r => r.Reply)
                .Include(r => r.User)
                .ToListAsync();
        }
    }
}