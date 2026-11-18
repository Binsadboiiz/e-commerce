namespace BE.Models.DTOs
{
    public class CreateVariantRequest
    {
        public decimal Price { get; set; }
        public int InitialStock { get; set; }
        public List<VariantAttributeRequest> Attributes { get; set; }
    }
}