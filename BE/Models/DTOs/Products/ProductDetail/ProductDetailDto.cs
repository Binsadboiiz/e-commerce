using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.DTOs.Products.ProductDetail
{
    public class ProductDetailDto
    {
        public long ProductId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Slug { get; set; }
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }

        public float RatingAvg { get; set; }
        public long RatingCount { get; set; }

        public string? BrandName { get; set; }
        public string? CategoryName { get; set; }

        public bool HasVariants { get; set; }


        [ForeignKey("ProductId")]
        public List<ProductImageDto> Images { get; set; } = [];
    
        public List<ProductVariantDto> Variants { get; set; } = [];

        public Dictionary<string, long> VariantMap { get; set; } = new();
    }
}
