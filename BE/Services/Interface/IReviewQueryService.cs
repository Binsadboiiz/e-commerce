using BE.Models.DTOs.Reviews;

namespace BE.Services.Interface
{
    public interface IReviewQueryService
    {
        Task<ProductReviewResponseDto> GetProductReviewsAsync(
            long productId,
            int page,
            int pageSize,
            string sortBy
        );
    }
}