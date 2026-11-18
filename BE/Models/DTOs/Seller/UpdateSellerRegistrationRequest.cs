using BE.Models.DTOs.Seller.Shared;

namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Request to update seller registration information.
    /// </summary>
    public class UpdateSellerRegistrationRequest
    {
        public SellerAddressDto? Address { get; set; }

        public SellerBankDto? Bank { get; set; }

        public SellerBusinessDto? Business { get; set; }
    }
}