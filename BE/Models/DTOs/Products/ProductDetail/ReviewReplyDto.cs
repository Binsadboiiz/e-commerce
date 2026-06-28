namespace BE.Models.DTOs.Reviews
{
    public class ReviewReplyDto
    {
        public long ReplyId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public long ShopId { get; set; }
    }
}