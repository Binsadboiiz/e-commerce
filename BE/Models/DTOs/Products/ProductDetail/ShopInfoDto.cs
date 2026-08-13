namespace BE.Models.DTOs.Products.ProductDetail
{
    public class ShopInfoDto
    {
        public long ShopId { get; set; }

        public string ShopName { get; set; } = string.Empty;

        public string? ShopAvatar { get; set; }

        public string Status { get; set; } = string.Empty;

        public bool IsOnline { get; set; }

        public float Rating { get; set; }

        public int ProductCount { get; set; }

        public double ResponseRate { get; set; }

        public string ResponseTime { get; set; } = "--";

        public DateTime JoinedAt { get; set; }

        public int Followers { get; set; }
    }
}
