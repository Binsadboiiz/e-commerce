using BE.Data;
using BE.Models.DTOs.Reviews;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Review;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Review
{
    public class ReviewQueryService : IReviewQueryService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly ApplicationDbContext _context;

        public ReviewQueryService(
            IReviewRepository reviewRepository,
            ApplicationDbContext context)
        {
            _reviewRepository = reviewRepository;
            _context = context;
        }

        public async Task<ProductReviewResponseDto> GetProductReviewsAsync(
            long productId,
            int page,
            int pageSize,
            string sortBy)
        {
            page = page <= 0 ? 1 : page;
            pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 50);

            var query = _reviewRepository.Query()
                .Where(r => r.ProductId == productId);

            // =========================
            // SORTING
            // =========================
            query = sortBy switch
            {
                "oldest" => query.OrderBy(r => r.CreatedAt),
                "highest" => query.OrderByDescending(r => r.Rating),
                "lowest" => query.OrderBy(r => r.Rating),
                _ => query.OrderByDescending(r => r.CreatedAt)
            };

            var total = await query.CountAsync();

            var reviews = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ReviewItemDto
                {
                    ReviewId = r.ReviewId,

                    UserName = !string.IsNullOrEmpty(r.User.FullName)
                        ? r.User.FullName
                        : "User",

                    Avatar = string.IsNullOrEmpty(r.User.Avatar)
                        ? "/images/default-avatar.png"
                        : r.User.Avatar,

                    Rating = r.Rating,

                    Content = r.Content ?? string.Empty,

                    CreatedAt = r.CreatedAt,

                    Images = r.Images
                        .OrderBy(i => i.SortOrder)
                        .Select(i => new ReviewImageDto
                        {
                            ReviewImageId = i.ReviewImageId,
                            ImageUrl = i.ImageUrl,
                            SortOrder = i.SortOrder
                        })
                        .ToList(),

                    SellerReply = r.Reply == null ? null : new ReviewReplyDto
                    {
                        ReplyId = r.Reply.ReplyId,
                        Content = r.Reply.Content,
                        CreatedAt = r.Reply.CreatedAt,
                        ShopId = r.Reply.ShopId
                    }
                })
                .ToListAsync();

            // =========================
            // RATING STATISTICS
            // =========================

            var ratingGroups = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .GroupBy(r => r.Rating)
                .Select(g => new
                {
                    Rating = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var totalReviews = ratingGroups.Sum(x => x.Count);

            var ratingSummary = Enumerable.Range(1, 5)
                .Select(i =>
                {
                    var found = ratingGroups.FirstOrDefault(x => x.Rating == i);

                    return new RatingSummaryDto
                    {
                        Rating = (byte)i,
                        Count = found?.Count ?? 0,
                        Percentage = totalReviews == 0
                            ? 0
                            : Math.Round((found?.Count ?? 0) * 100.0 / totalReviews, 1)
                    };
                })
                .OrderByDescending(x => x.Rating)
                .ToList();

            var ratingAverage = totalReviews == 0
                ? 0
                : await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .AverageAsync(r => r.Rating);

            return new ProductReviewResponseDto
            {
                RatingAverage = ratingAverage,
                TotalReviews = totalReviews,
                RatingSummary = ratingSummary,
                Reviews = reviews,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            };
        }
    }
}