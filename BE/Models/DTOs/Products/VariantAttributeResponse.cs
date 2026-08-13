namespace BE.Models.DTOs
{
    public class VariantAttributeResponse
    {
        public long AttributeTypeId { get; set; }

        public string AttributeName { get; set; }

        public long AttributeValueId { get; set; }

        public string AttributeValue { get; set; }
    }
}