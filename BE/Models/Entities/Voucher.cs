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

        // maximum discount limit (optional)
        public double? MaxDiscount { get; set; }

        // minimum order value condition
        public double? MinOrderValue { get; set; }

        public DateTime? ExpiredAt { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        [MaxLength(20)]
        public string VoucherType { get; set; } = "AllItems"; // Shipping, AllItems, Category

        public long? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        public long? ShopId { get; set; }

        [ForeignKey("ShopId")]
        public Shop? Shop { get; set; }

        public int? UsageLimit { get; set; }

        public int UsageCount { get; set; } = 0;

        // ========================
        // Navigation
        // ========================
        public ICollection<OrderVoucher> OrderVouchers { get; set; }
    }
}