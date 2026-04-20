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

        public string VariantName { get; set; } 
        public string VariantValue { get; set; } 
        public double? PriceAdjustment { get; set; } 
        public int Stock { get; set; }

        // Navigation
        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }
        public ICollection<VariantAttribute> VariantAttributes { get; set; } = new List<VariantAttribute>();
    }
}
