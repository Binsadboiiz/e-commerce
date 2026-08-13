namespace BE.Models.DTOs
{
    public class AttributeDto
    {
        public long AttributeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<AttributeValueDto> Values { get; set; } = new();
    }
}