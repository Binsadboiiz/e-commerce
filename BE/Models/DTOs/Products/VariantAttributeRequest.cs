namespace BE.Models.DTOs
{
    public class VariantAttributeRequest
    {
        public long? AttributeTypeId { get; set; }
        public long? AttributeValueId { get; set; }
        public string? AttributeName { get; set; }
        public string? Value { get; set; }
    }
}