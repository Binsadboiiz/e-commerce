using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Seller_addresses")]
    public class SellerAddress
    {
        [Key]
        public long SellerAddressId { get; set; }

        public string SellerId { get; set; } = null!;

        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string? City { get; set; }

        public string? District { get; set; }

        public string? Ward { get; set; }

        public string? StreetAddress { get; set; }

        public string? PostalCode { get; set; }

        public bool IsDefault { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation
        public SellerAccount SellerAccount { get; set; } = null!;
    }
}