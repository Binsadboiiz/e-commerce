using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Seller_documents")]
    public class SellerDocument
    {
        [Key]
        public long DocumentId { get; set; }

        public string SellerId { get; set; } = null!;

        public int DocumentTypeId { get; set; }

        public string FileUrl { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        // Navigation
        public SellerAccount SellerAccount { get; set; } = null!;
        public SellerDocumentType SellerDocumentType { get; set; } = null!;
    }
}