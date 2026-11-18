namespace BE.Models.DTOs.Products.ProductFilter
{
    public class ProductFilterMetaDto
    {
        public List<FilterOptionDto> Colors { get; set; } = new();
        public List<FilterOptionDto> Sizes { get; set; } = new();
        public List<FilterOptionDto> Materials { get; set; } = new();
        public List<FilterOptionDto> Brands { get; set; } = new();
        public List<FilterOptionDto> Categories { get; set; } = new();
    }
}
