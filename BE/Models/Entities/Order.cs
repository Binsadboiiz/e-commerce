using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        public long OrderId { get; set; }

        public string CustomerId { get; set; }
        public long TotalAmount { get; set; }

        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }

        public long AddressId { get; set; }

        public DateTime Create_At { get; set; }

        // Navigation
        public User Customer { get; set; }
        public Address Address { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
