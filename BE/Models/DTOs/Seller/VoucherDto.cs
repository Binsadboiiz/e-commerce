using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs.Seller
{
    public class VoucherDto
    {
        public long Id { get; set; }
        public string Code { get; set; } = null!;
        public string DiscountType { get; set; } = null!;
        public double Value { get; set; }
        public double? MaxDiscount { get; set; }
        public double? MinOrderValue { get; set; }
        public DateTime? ExpiredAt { get; set; }
        public bool IsActive { get; set; }
        public string VoucherType { get; set; } = null!;
        public long? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public long? ShopId { get; set; }
        public string? ShopName { get; set; }
        public int? UsageLimit { get; set; }
        public int UsageCount { get; set; }
    }

    public class CreateVoucherRequest
    {
        [Required]
        [MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Voucher code can only contain alphanumeric characters, underscores, and hyphens.")]
        public string Code { get; set; } = null!;

        [Required]
        [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be either 'percent' or 'fixed'.")]
        public string DiscountType { get; set; } = null!;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Value must be greater than 0.")]
        public double Value { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Max discount must be non-negative.")]
        public double? MaxDiscount { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Min order value must be non-negative.")]
        public double? MinOrderValue { get; set; }

        public DateTime? ExpiredAt { get; set; }

        [Required]
        [RegularExpression("^(AllItems|Shipping|Category)$", ErrorMessage = "Voucher type must be 'AllItems', 'Shipping', or 'Category'.")]
        public string VoucherType { get; set; } = "AllItems";

        public long? CategoryId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Usage limit must be greater than 0.")]
        public int? UsageLimit { get; set; }
    }

    public class UpdateVoucherRequest
    {
        [Required]
        [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be either 'percent' or 'fixed'.")]
        public string DiscountType { get; set; } = null!;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Value must be greater than 0.")]
        public double Value { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Max discount must be non-negative.")]
        public double? MaxDiscount { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Min order value must be non-negative.")]
        public double? MinOrderValue { get; set; }

        public DateTime? ExpiredAt { get; set; }

        public bool IsActive { get; set; } = true;

        [Range(1, int.MaxValue, ErrorMessage = "Usage limit must be greater than 0.")]
        public int? UsageLimit { get; set; }
    }

    public class VoucherApplicableDto
    {
        public long Id { get; set; }
        public string Code { get; set; } = null!;
        public string DiscountType { get; set; } = null!;
        public double Value { get; set; }
        public double? MaxDiscount { get; set; }
        public double? MinOrderValue { get; set; }
        public DateTime? ExpiredAt { get; set; }
        public string VoucherType { get; set; } = null!;
        public long? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public long? ShopId { get; set; }
        public string? ShopName { get; set; }
        public int? UsageLimit { get; set; }
        public int UsageCount { get; set; }
        public bool IsApplicable { get; set; }
        public string? Reason { get; set; }
    }
}
