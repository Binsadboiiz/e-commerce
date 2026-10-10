namespace BE.Models.DTOs.Search
{
    public class SearchSuggestionDto
    {
        public List<CategorySuggestionDto> Categories { get; set; } = new();
        public List<BrandSuggestionDto> Brands { get; set; } = new();
        public List<ProductSuggestionDto> Products { get; set; } = new();
        public List<string> Keywords { get; set; } = new();
    }

    public class CategorySuggestionDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProductCount { get; set; }
    }

    public class BrandSuggestionDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProductCount { get; set; }
    }

    public class ProductSuggestionDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public decimal FinalPrice { get; set; }
        public string? ImageUrl { get; set; }
        public float RatingAvg { get; set; }
        public string? CategoryName { get; set; }
        public string? BrandName { get; set; }
    }
}