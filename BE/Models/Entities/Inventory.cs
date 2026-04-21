namespace BE.Models.Entities
{
    public class Inventory
    {
        public long Id { get; set; }

        public long ProductVariantId { get; set; }

        public int AvailableStock { get; set; }

        public int ReservedStock { get; set; }

        public int SoldStock { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public ProductVariant ProductVariant { get; set; }
    }
}