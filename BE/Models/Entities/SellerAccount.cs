using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Seller_accounts")]
    public class SellerAccount
    {
        [Key]
        public string SellerId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        public int SellerTypeId { get; set; }

        [Required]
        public int SellerStatusId { get; set; }

        public int MaxShopLimit { get; set; } = 1;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation

        public virtual User User { get; set; } = null!;

        public virtual SellerType SellerType { get; set; } = null!;

        public virtual SellerStatus SellerStatus { get; set; } = null!;

        public virtual SellerBusiness? Business { get; set; }

        public virtual ICollection<SellerAddress> Addresses { get; set; } = new List<SellerAddress>();

        public virtual ICollection<SellerBank> Banks { get; set; } = new List<SellerBank>();

        public virtual ICollection<SellerDocument> Documents { get; set; } = new List<SellerDocument>();
    }
}