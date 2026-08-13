namespace BE.Models.DTOs.Reviews
{
    public class RatingSummaryDto
    {
        public byte Rating { get; set; }
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}