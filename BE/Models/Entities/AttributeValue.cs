using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Attribute_values")]
    public class AttributeValue
    {
        [Key]
        public long ValueId { get; set; }

        [Required]
        public long AttributeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Value { get; set; }


        [ForeignKey(nameof(AttributeId))]
        public AttributeType AttributeType { get; set; }

        public ICollection<ProductAttribute> ProductAttributes { get; set; }

        public ICollection<VariantAttribute> VariantAttributes { get; set; }
    }
}