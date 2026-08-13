using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Order_Vouchers")]
    public class OrderVoucher
    {
        [Key]
        public long Id { get; set; }

        // FK
        public long OrderId { get; set; }
        public long VoucherId { get; set; }

        // ========================
        // Navigation
        // ========================
        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [ForeignKey("VoucherId")]
        public Voucher Voucher { get; set; }
    }
}