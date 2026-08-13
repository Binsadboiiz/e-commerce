namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Request to change seller type while registration is still in Draft.
    /// Changing seller type will clear all onboarding information.
    /// </summary>
    public class ChangeSellerTypeRequest
    {
        public int SellerTypeId { get; set; }
    }
}