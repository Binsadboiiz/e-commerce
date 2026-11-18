using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Seller_businesses")]
    public class SellerBusiness
    {
        [Key]
        public long BusinessId { get; set; }

        public string SellerId { get; set; } = null!;

        public string? CompanyName { get; set; }

        public string? TaxCode { get; set; }

        public string? BusinessLicenseNumber { get; set; }

        public string? Representative { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation
        public SellerAccount SellerAccount { get; set; } = null!;
    }
}