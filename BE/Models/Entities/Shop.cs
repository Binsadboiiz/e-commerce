using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Shops")]
    public class Shop
    {
        [Key]
        public long ShopId { get; set; }

        public string OwnerId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string? Logo { get; set; }
        public bool IsActive { get; set; }

        public DateTime Create_At { get; set; }
        public DateTime Update_At { get; set; }

        // Navigation
        public User Owner { get; set; }
        public ICollection<Product> Products { get; set; }

        public ICollection<ShopAddresses> Addresses { get; set; }

        public ICollection<ReviewReply> ReviewReplies { get; set; } = new List<ReviewReply>();
    }
}
