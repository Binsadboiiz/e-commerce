namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Seller information displayed in the application header.
    /// </summary>
    public class SellerHeaderDto
    {
        public bool IsSeller { get; set; }

        public string? SellerStatusCode { get; set; }

        public string HeaderAction { get; set; } = string.Empty;
    }
}