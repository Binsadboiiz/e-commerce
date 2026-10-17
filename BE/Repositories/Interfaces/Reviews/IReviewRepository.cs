using BE.Models.Entities;

namespace BE.Repositories.Interfaces.Reviews
{
    public interface IReviewRepository
    {
        IQueryable<Review> Query();

        Task<Review?> GetByIdAsync(long reviewId);

        Task<List<Review>> GetByProductIdAsync(long productId, int take = 10);
    }
}
