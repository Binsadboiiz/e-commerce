namespace BE.Models.DTOs.Reviews
{
    public class ReviewImageDto
    {
        public long ReviewImageId { get; set; }
        public string ImageUrl { get; set; }
        public int SortOrder { get; set; }
    }
}