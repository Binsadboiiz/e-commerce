namespace BE.Models.DTOs
{
    public class ProductVariantResponse
    {
        public long VariantId { get; set; }

        public decimal Price { get; set; }

        public int AvailableStock { get; set; }

        public int ReservedStock { get; set; }

        public int SoldStock { get; set; }

        public List<VariantAttributeResponse> Attributes { get; set; }
            = new();
    }
}