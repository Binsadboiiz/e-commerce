using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Brands")]
    public class Brand
    {
        [Key]
        public long BrandId { get; set; }

        public string Name { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
