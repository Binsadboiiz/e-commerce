using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Review_Replies")]
    public class ReviewReply
    {
        [Key]
        public long ReplyId { get; set; }

        public long ReviewId { get; set; }

        public long ShopId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        // NAVIGATION
        public Review Review { get; set; }
        public Shop Shop { get; set; }
    }
}