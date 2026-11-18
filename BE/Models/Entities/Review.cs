using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Reviews")]
    public class Review
    {
        [Key]
        public long ReviewId { get; set; }

        public long ProductId { get; set; }

        [Required]
        public string UserId { get; set; }

        public long? OrderItemId { get; set; }

        public byte Rating { get; set; }

        public string Content { get; set; }

        public bool IsHidden { get; set; } = false;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // NAVIGATION
        public Product Product { get; set; }

        public User User { get; set; }

        public ReviewReply? Reply { get; set; }

        public ICollection<ReviewImage> Images { get; set; }
            = new List<ReviewImage>();
    }
}