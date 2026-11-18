namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Response payload containing seller shop onboarding status and suggested pre-filled details.
    /// </summary>
    public class SellerShopStatusDto
    {
        public bool HasShop { get; set; }
        public long? ShopId { get; set; }
        public string? ShopName { get; set; }
        public string? SuggestedName { get; set; }
        public string? SuggestedPhone { get; set; }
        public string? SuggestedCity { get; set; }
        public string? SuggestedDistrict { get; set; }
        public string? SuggestedWard { get; set; }
        public string? SuggestedStreetAddress { get; set; }
        public string? SellerStatusCode { get; set; }
    }
}
