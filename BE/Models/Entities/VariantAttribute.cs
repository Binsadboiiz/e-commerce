using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Variant_attributes")]
    public class VariantAttribute
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long VariantId { get; set; }

        [Required]
        public long ValueId { get; set; }

        [ForeignKey(nameof(VariantId))]
        public ProductVariant ProductVariant { get; set; } = null!;

        [ForeignKey(nameof(ValueId))]
        public AttributeValue AttributeValue { get; set; } = null!;


    }
}
