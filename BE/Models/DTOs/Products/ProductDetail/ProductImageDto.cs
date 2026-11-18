namespace BE.Models.DTOs.Products.ProductDetail
{
    public class ProductImageDto
    {
        public long ImageId { get; set; }

        public long? VariantId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public int SortOrder { get; set; }

        public bool IsPrimary { get; set; }
    }
}
