namespace BE.Models.DTOs.Products.ProductDetail
{
    public class ProductAttributeGroupDto
    {
        public long AttributeId { get; set; }

        public string AttributeName { get; set; } = null!;

        public List<ProductAttributeValueDto> AttributeValues { get; set; } = [];
    }
}
