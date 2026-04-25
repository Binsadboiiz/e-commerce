using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Product_images")]
    public class ProductImage
    {
        [Key]
        public long ImageId { get; set; }

        [Required]
        public long ProductId { get; set; }

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsPrimary { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; } = null!;
    }
}