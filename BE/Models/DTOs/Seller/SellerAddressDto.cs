namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Represents seller address information.
    ///
    /// This DTO is reusable across multiple modules:
    /// - Seller Registration
    /// - Shop Management
    /// </summary>
    public class SellerAddressDto
    {
  
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? StreetAddress { get; set; }
        public string? PostalCode { get; set; }
        public bool IsDefault { get; set; }
    }
}