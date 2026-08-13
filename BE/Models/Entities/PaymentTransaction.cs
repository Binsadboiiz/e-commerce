using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("PaymentTransactions")]
    public class PaymentTransaction
    {
        [Key]
        public long Id { get; set; }

        // FK tới Order
        public long OrderId { get; set; }

        // card | cod | momo | vnpay...
        [Required]
        [MaxLength(50)]
        public string Method { get; set; }

        // pending | paid | failed
        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        // mã giao dịch từ bên thứ 3 (VNPay, Stripe...)
        public string? TransactionCode { get; set; }

        public DateTime? PaidAt { get; set; }

        // ========================
        // Navigation
        // ========================
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}