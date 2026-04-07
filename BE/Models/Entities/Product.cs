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
        public string RetailerId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public double? DiscountPrice { get; set; }
        public int Stock { get; set; }

        public long CategoryId { get; set; }
        public long BrandId { get; set; }

        public string Image { get; set; }

        public float RatingAvg { get; set; }
        public long RatingCount { get; set; }

        public string Status { get; set; }

        // Navigation
        public Shop Shop { get; set; }
        public User Retailer { get; set; }
        public Category Category { get; set; }
        public Brand Brand { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
    }
}
