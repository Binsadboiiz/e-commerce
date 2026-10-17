using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs
{
    public class BuyNowRequest
    {
        [Required]
        public long ProductId { get; set; }

        public long? VariantId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        public long? AddressId { get; set; }

        [Required]
        public string PaymentMethod { get; set; }

        public List<string> VoucherCodes { get; set; } = new();
    }
}