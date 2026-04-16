using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Vouchers")]
    public class Voucher
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Code { get; set; }

        // percent | fixed
        [Required]
        public string DiscountType { get; set; }

        [Required]
        public double Value { get; set; }

        // giới hạn giảm tối đa (optional)
        public double? MaxDiscount { get; set; }

        // điều kiện đơn tối thiểu
        public double? MinOrderValue { get; set; }

        public DateTime? ExpiredAt { get; set; }

        public bool IsActive { get; set; } = true;

        // ========================
        // Navigation
        // ========================
        public ICollection<OrderVoucher> OrderVouchers { get; set; }
    }
}