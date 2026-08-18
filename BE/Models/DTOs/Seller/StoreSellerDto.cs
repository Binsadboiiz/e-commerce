using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Request DTO for updating store profile details.
    /// </summary>
    public class UpdateStoreRequest
    {
        [Required(ErrorMessage = "Store name is required.")]
        [StringLength(255, ErrorMessage = "Store name cannot exceed 255 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? Logo { get; set; }

        [StringLength(255, ErrorMessage = "Store address cannot exceed 255 characters.")]
        public string? StoreAddress { get; set; }

        [StringLength(100, ErrorMessage = "Store city cannot exceed 100 characters.")]
        public string? StoreCity { get; set; }

        [StringLength(50, ErrorMessage = "Store state cannot exceed 50 characters.")]
        public string? StoreState { get; set; }

        [StringLength(20, ErrorMessage = "Zip code cannot exceed 20 characters.")]
        public string? StoreZipCode { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format.")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters.")]
        public string? StorePhone { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        [StringLength(100, ErrorMessage = "Email address cannot exceed 100 characters.")]
        public string? StoreEmail { get; set; }
    }

    /// <summary>
    /// Response DTO containing combined shop profile and extended store details.
    /// </summary>
    public class StoreDetailResponse
    {
        public long ShopId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Logo { get; set; }
        public string? StoreAddress { get; set; }
        public string? StoreCity { get; set; }
        public string? StoreState { get; set; }
        public string? StoreZipCode { get; set; }
        public string? StorePhone { get; set; }
        public string? StoreEmail { get; set; }
    }
}