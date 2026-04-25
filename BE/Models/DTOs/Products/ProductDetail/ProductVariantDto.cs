namespace BE.Models.DTOs.Products.ProductDetail
{
    public class ProductVariantDto
    {
        public long VariantId { get; set; }

        public string VariantName { get; set; } = string.Empty;

        public string VariantValue { get; set; } = string.Empty;

        public decimal PriceAdjustment { get; set; }

        public decimal FinalPrice { get; set; }

        public int Stock { get; set; }
    }
}
