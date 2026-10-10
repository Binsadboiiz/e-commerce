using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Request payload for initial seller shop setup during onboarding.
    /// </summary>
    public class SetupShopRequest
    {
        [Required(ErrorMessage = "Shop name is required")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? StreetAddress { get; set; }
        public string? Logo { get; set; }
    }
}
