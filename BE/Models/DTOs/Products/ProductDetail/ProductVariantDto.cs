namespace BE.Models.DTOs.Products
{
    public class ProductVariantDto
    {
        public long VariantId { get; set; }

        public decimal Price { get; set; }

        public int AvailableStock { get; set; }

        public List<VariantAttributeDto> Attributes { get; set; } = new();
    }
}
