using System.ComponentModel.DataAnnotations;

namespace BE.Models.Entities
{
    public class Cart
    {
        [Key]
        public long CartId { get; set; }

        public string UserId { get; set; }
        public DateTime Create_At { get; set; }

        // Navigation
        public User User { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
    }
}
