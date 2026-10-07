namespace BE.Models.DTOs
{
    public class ProductListDto
    {
        public long Id { get; set; }

        public string Slug { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }

        public decimal FinalPrice { get; set; }

        public int Stock { get; set; }

        public string? ImageUrl { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();

        public float RatingAvg { get; set; }

        public long? RatingCount { get; set; }

        public long CategoryId { get; set; }
        public long BrandId { get; set; }
        public string? CategoryName { get; set; }
        public string? BrandName { get; set; }

        public int AvailableStock { get; set; }

        // Retailer-specific fields
        public string? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int SoldCount { get; set; }
        public string? Description { get; set; }
    }
}