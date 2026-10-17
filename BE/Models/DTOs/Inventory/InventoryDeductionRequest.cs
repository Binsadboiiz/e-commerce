namespace BE.Models.DTOs
{
    public class InventoryDeductionRequest
    {
        public long VariantId { get; set; }
        public int Quantity { get; set; }
    }
}
