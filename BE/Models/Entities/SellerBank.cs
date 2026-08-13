using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Seller_banks")]
    public class SellerBank
    {
        [Key]
        public long SellerBankId { get; set; }

        public string SellerId { get; set; } = null!;

        public string? BankCode { get; set; }

        public string? AccountNumber { get; set; }

        public string? AccountName { get; set; }

        public bool IsPrimary { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        // Navigation
        public SellerAccount SellerAccount { get; set; } = null!;
    }
}