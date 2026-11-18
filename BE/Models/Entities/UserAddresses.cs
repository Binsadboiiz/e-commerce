using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("User_addresses")]
    public class UserAddresses
    {
        [Key]
        public long Id { get; set; }

        public string UserId { get; set; }

        public string FullName { get; set; }
        public long PhoneNumber { get; set; }
        public string City { get; set; }
        public string StreetName { get; set; }
        public string HouseNo { get; set; }
        public bool IsDefault { get; set; }

        // Navigation
        public User User { get; set; }
    }
}
