using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Users")]
    public class User
    {
        [Key]
        public string UserId { get; set; }

        public string Email { get; set; }
        public string FullName { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }

        [Column("IsActive")]
        public bool Is_active { get; set; } = true;

        //Mapping 
        public Cart? Cart { get; set; }
        public SellerAccount? SellerAccount { get; set; }

        // Navigation
        public ICollection<UserAddresses> UserAddressesCollection { get; set; } = new List<UserAddresses>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Shop> Shops { get; set; } = new List<Shop>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
