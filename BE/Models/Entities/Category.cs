using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Categories")]
    public class Category
    {
        [Key]
        public long CategoryId { get; set; }

        public string Type { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
