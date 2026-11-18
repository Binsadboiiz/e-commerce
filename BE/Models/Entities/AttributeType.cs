using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Attributes")]
    public class AttributeType
    {
        [Key]
        public long AttributeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public ICollection<AttributeValue> AttributeValues { get; set; } = new List<AttributeValue>();
     }
}
