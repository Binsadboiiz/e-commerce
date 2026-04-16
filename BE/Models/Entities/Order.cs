using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        public long OrderId { get; set; }

        // User who places the order.
        public string CustomerId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MerchandiseSubtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingFee { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal FinalAmount { get; set; }

        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }

        public long AddressId { get; set; }

        public DateTime Create_At { get; set; }

        // Navigation
        public User Customer { get; set; }
        public Address Address { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<OrderVoucher> OrderVouchers { get; set; }

        // A COD order still creates a payment transaction record to track fulfillment.
        public PaymentTransaction PaymentTransaction { get; set; }
    }
}
