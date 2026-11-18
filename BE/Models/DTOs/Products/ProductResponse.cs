namespace BE.Models.DTOs
{
    public class ProductResponse
    {
        public long ProductId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public List<ProductVariantResponse> Variants { get; set; }
    }
}