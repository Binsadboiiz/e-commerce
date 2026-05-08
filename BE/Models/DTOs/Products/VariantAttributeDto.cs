namespace BE.Models.DTOs.Products
{
    public class VariantAttributeDto
    {
        public long AttributeId { get; set; }

        public string AttributeName { get; set; } = string.Empty;

        public long ValueId { get; set; }

        public string Value { get; set; } = string.Empty;
    }
}
