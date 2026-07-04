using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Seller_document_types")]
    public class SellerDocumentType
    {
        [Key]
        public int DocumentTypeId { get; set; }

        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; }

        // Navigation
        public ICollection<SellerDocument> SellerDocuments { get; set; } = new List<SellerDocument>();
    }
}