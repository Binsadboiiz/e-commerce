namespace BE.Models.DTOs.Reviews
{
    public class ProductReviewResponseDto
    {
        public double RatingAverage { get; set; }
        public long TotalReviews { get; set; }

        public List<RatingSummaryDto> RatingSummary { get; set; }

        public List<ReviewItemDto> Reviews { get; set; }

        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}