namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Basic seller information.
    /// </summary>
    public class SellerSummaryDto
    {
        public string SellerId { get; set; } = string.Empty;

        public int SellerTypeId { get; set; }

        public string SellerTypeCode { get; set; } = string.Empty;

        public int SellerStatusId { get; set; }

        public string SellerStatusCode { get; set; } = string.Empty;

        public int MaxShopLimit { get; set; }

        public bool HasShop { get; set; }
    }
}