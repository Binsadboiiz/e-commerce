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

        [NotMapped]
        public int? Stock { get; set; }

        [MaxLength(100)]
        public string? SKU { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; } 

        // Navigation
        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; } 
        public ICollection<VariantAttribute> VariantAttributes { get; set; } = new List<VariantAttribute>();

        public Inventory? Inventory { get; set; }

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
}
