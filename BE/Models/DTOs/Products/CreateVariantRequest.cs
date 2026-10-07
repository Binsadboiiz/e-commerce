namespace BE.Models.DTOs
{
    public class CreateVariantRequest
    {
        public string? Sku { get; set; }
        public string? VariantName { get; set; }
        public decimal Price { get; set; }
        public int InitialStock { get; set; }
        public List<VariantAttributeRequest>? Attributes { get; set; }
    }
}