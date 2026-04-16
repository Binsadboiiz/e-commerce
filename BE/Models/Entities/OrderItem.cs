using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Order_items")]
    public class OrderItem
    {
        [Key]
        public long Id { get; set; }

        public long OrderId { get; set; }
        public long ShopId { get; set; }
        public long ProductId { get; set; }
        public long? VariantId { get; set; }

        public string ProductName { get; set; }
        public string? ProductImage { get; set; }
        public string? VariantName { get; set; }
        public string? VariantValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        // Navigation
        public Order Order { get; set; }
        public Shop Shop { get; set; }
        public Product Product { get; set; }
        public ProductVariant? Variant { get; set; }
    }
}
