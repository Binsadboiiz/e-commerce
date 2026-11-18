namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Request to initialize a seller registration.
    /// </summary>
    public class CreateSellerRegistrationRequest
    {
        public int SellerTypeId { get; set; }
    }
}