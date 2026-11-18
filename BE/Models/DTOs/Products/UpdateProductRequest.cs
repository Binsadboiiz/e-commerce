using BE.Constants;

namespace BE.Models.DTOs
{
    public class UpdateProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public long CategoryId { get; set; }
        public long BrandId { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string? ImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }
        public string Status { get; set; } = ProductConstants.ProductStatusActive;
        public int Stock { get; set; }
        public List<CreateVariantRequest>? Variants { get; set; }
    }
}
