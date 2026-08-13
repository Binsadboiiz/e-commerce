using BE.Models.DTOs;
using BE.Models.DTOs.Reviews;
using BE.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Review
{
    [ApiController]
    [Route("api/products/{productId:long}/reviews")]
    [AllowAnonymous]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewQueryService _reviewQueryService;

        public ReviewController(IReviewQueryService reviewQueryService)
        {
            _reviewQueryService = reviewQueryService;
        }

        /// <summary>
        /// Get product reviews with pagination + sorting
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProductReviews(
            long productId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "newest")
        {
            var result = await _reviewQueryService.GetProductReviewsAsync(
                productId,
                page,
                pageSize,
                sortBy
            );

            return Ok(ApiResponse<ProductReviewResponseDto>.SuccessResponse(result));
        }
    }
}