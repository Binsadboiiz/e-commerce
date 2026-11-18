using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    /// <summary>
    /// Represents extended profile details for a store (address, contact info).
    /// Shares a 1-to-1 relationship with the Shop entity via ShopId PK/FK.
    /// </summary>
    [Table("StoreDetails")]
    public class StoreDetail
    {
        [Key]
        [ForeignKey(nameof(Shop))]
        public long ShopId { get; set; }

        public string? StoreAddress { get; set; }
        public string? StoreCity { get; set; }
        public string? StoreState { get; set; }
        public string? StoreZipCode { get; set; }
        public string? StorePhone { get; set; }
        public string? StoreEmail { get; set; }

        // Navigation property
        public Shop Shop { get; set; } = null!;
    }
}