namespace BE.Models.DTOs
{
    public class BuyNowRequest
    {
        [System.ComponentModel.DataAnnotations.Required]
        public long ProductId { get; set; }

        public long? VariantId { get; set; }

        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        public long AddressId { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        public string PaymentMethod { get; set; }

        public List<string> VoucherCodes { get; set; } = new();
    }
}