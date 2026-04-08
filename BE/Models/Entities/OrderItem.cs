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

        public string ProductName { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }

        // Navigation
        public Order Order { get; set; }
        public Shop Shop { get; set; }
        public Product Product { get; set; }
    }
}
