using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Addresses")]
    public class Address
    {
        [Key]
        public long Id { get; set; }

        public string UserId { get; set; }

        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
        public string StreetName { get; set; }
        public string HouseNo { get; set; }
        public bool IsDefault { get; set; }

        // Navigation
        public User User { get; set; }
    }
}
