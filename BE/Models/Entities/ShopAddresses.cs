using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Shop_addresses")]
    public class ShopAddresses
    {
        [Key]
        public long Id { get; set; }

        public long ShopId { get; set; }

        [ForeignKey(nameof(ShopId))]
        public Shop Shop { get; set; }

        [Column(TypeName = "varchar(100)")]
        public string City { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string StreetName { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string HouseNo { get; set; }
    }
}