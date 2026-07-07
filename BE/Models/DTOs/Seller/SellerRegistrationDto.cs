using BE.Models.DTOs.Seller.Shared;

namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Complete seller registration information.
    /// </summary>
    public class SellerRegistrationDto
    {
        public SellerSummaryDto Summary { get; set; } = new();

        public SellerAddressDto? Address { get; set; }

        public SellerBankDto? Bank { get; set; }

        public SellerBusinessDto? Business { get; set; }

        public List<SellerDocumentDto> Documents { get; set; } = new();

        public SellerRegistrationProgressDto Progress { get; set; } = new();
    }
}