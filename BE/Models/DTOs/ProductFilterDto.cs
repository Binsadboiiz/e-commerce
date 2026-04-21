namespace BE.Models.DTOs
{
    public class ProductFilterDto
    {
        public string? Search { get; set; }

        public List<long>? CategoryIds { get; set; }

        public List<long>? BrandIds { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public List<long>? AttributeValueIds { get; set; }

        public float? MinRating { get; set; }

        public string? SortBy { get; set; }

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
