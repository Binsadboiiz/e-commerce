using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public long ProductId { get; set; }

        public long ShopId { get; set; }

        [Required]
        [MaxLength(50)]
        public string RetailerId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountPrice { get; set; }

        public int Stock { get; set; }

        public long CategoryId { get; set; }
        public long BrandId { get; set; }

        public string? Image { get; set; }

        public float RatingAvg { get; set; } = 0;
        public long RatingCount { get; set; } = 0;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "active";

        public string Slug { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(ShopId))]
        public Shop? Shop { get; set; }

        [ForeignKey(nameof(RetailerId))]
        public User? Retailer { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public Category? Category { get; set; }

        [ForeignKey(nameof(BrandId))]
        public Brand? Brand { get; set; }
        
        public ICollection<CartItem> CartItems { get; set; }
        public ICollection<ProductVariant> Variants { get; set; }
        public ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
}
