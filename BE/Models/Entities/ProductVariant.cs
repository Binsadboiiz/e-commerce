using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Product_variants")]
    public class ProductVariant
    {
        [Key]
        public long VariantId { get; set; }

        public long ProductId { get; set; }

        public string VariantName { get; set; }   // e.g. "Size", "Color"
        public string VariantValue { get; set; }   // e.g. "L", "Black"
        public double? PriceAdjustment { get; set; } // additional price for this variant
        public int Stock { get; set; }

        // Navigation
        public Product Product { get; set; }
    }
}
