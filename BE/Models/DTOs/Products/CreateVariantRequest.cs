namespace BE.Models.DTOs
{
    public class CreateVariantRequest
    {
        public long? VariantId { get; set; }
        public string? Sku { get; set; }
        public string? VariantName { get; set; }
        public decimal Price { get; set; }
        public int InitialStock { get; set; }
        public string? ImageUrl { get; set; }
        public List<VariantAttributeRequest>? Attributes { get; set; }
    }
}