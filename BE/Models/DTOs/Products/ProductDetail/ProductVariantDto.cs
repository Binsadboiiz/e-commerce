namespace BE.Models.DTOs.Products
{
    public class ProductVariantDto
    {
        public long VariantId { get; set; }

        public decimal Price { get; set; }

        public int AvailableStock { get; set; }

        public string SKU { get; set; } = string.Empty;

        public bool IsAvailable { get; set; }

        public List<long> ImageIds { get; set; } = new();

        public List<VariantAttributeDto> Attributes { get; set; } = new();
    }
}
