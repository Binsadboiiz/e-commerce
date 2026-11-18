namespace BE.Models.DTOs.Reviews
{
    public class ReviewItemDto
    {
        public long ReviewId { get; set; }

        public string UserName { get; set; }
        public string Avatar { get; set; }

        public byte Rating { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<ReviewImageDto> Images { get; set; }

        public ReviewReplyDto? SellerReply { get; set; }
    }
}