namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Represents business information for BUSINESS sellers.
    ///
    /// PERSONAL sellers do not use this DTO.
    /// </summary>
    public class SellerBusinessDto
    {
        public string? CompanyName { get; set; }
        public string? TaxCode { get; set; }
        public string? BusinessLicenseNumber { get; set; }
        public string? Representative { get; set; }
    }
}