using System;

namespace BE.Models.DTOs.Admin.Dashboard
{
    public class AdminSellerApplicationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Representative { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string SellerType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string TaxCode { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
