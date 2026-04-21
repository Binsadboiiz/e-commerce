namespace BE.Models.DTOs
{
    public class CreateProductRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public long CategoryId { get; set; }
        public long BrandId { get; set; }
        public List<CreateVariantRequest> Variants { get; set; }
    }
}