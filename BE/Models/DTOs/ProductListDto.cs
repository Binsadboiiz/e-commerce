namespace BE.Models.DTOs
{
    public class ProductListDto
    {
        public long ProductId { get; set; }

        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }

        public int Stock { get; set; }

        public string? Image { get; set; }

        public float RatingAvg { get; set; }

        public string CategoryName { get; set; }
        public string BrandName { get; set; }
    }
}
