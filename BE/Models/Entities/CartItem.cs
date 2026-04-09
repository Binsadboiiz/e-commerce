using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Cart_items")]
    public class CartItem
    {
        [Key]
        public long Id { get; set; }

        public long CartId { get; set; }
        public long ProductId { get; set; }

        public int Quantity { get; set; }

        // Navigation
        public Cart Cart { get; set; }
        public Product Product { get; set; }
    }
}
