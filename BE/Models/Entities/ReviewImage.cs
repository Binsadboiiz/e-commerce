using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Review_Images")]
    public class ReviewImage
    {
        [Key]
        public long ReviewImageId { get; set; }

        public long ReviewId { get; set; }

        public string ImageUrl { get; set; }

        public int SortOrder { get; set; }

        // NAVIGATION
        public Review Review { get; set; }
    }
}