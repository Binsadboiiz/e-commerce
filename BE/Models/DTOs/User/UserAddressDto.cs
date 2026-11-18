using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs.User
{
    public class UserAddressDto
    {
        public long Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string StreetAddress { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

    public class CreateUserAddressRequest
    {
        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(255)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone is required")]
        public string PhoneNumber { get; set; } = string.Empty;

        public string? Phone
        {
            get => PhoneNumber;
            set { if (!string.IsNullOrWhiteSpace(value)) PhoneNumber = value; }
        }

        [Required(ErrorMessage = "Province/City is required.")]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? District { get; set; }

        [MaxLength(100)]
        public string? Ward { get; set; }

        [MaxLength(255)]
        public string? StreetName { get; set; }

        public string StreetAddress { get; set; } = string.Empty;

        public string? HouseNo
        {
            get => StreetAddress;
            set { if (!string.IsNullOrWhiteSpace(value)) StreetAddress = value; }
        }

        public bool IsDefault { get; set; } = false;
    }

    public class UpdateUserAddressRequest
    {
        [Required(ErrorMessage = "The recipient's full name is required.")]
        [MaxLength(255)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "The phone number is required")]
        public string PhoneNumber { get; set; } = string.Empty;

        public string? Phone
        {
            get => PhoneNumber;
            set { if (!string.IsNullOrWhiteSpace(value)) PhoneNumber = value; }
        }

        [Required(ErrorMessage = "Province/City is required.")]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? District { get; set; }

        [MaxLength(100)]
        public string? Ward { get; set; }

        [MaxLength(255)]
        public string? StreetName { get; set; }

        public string StreetAddress { get; set; } = string.Empty;

        public string? HouseNo
        {
            get => StreetAddress;
            set { if (!string.IsNullOrWhiteSpace(value)) StreetAddress = value; }
        }

        public bool IsDefault { get; set; } = false;
    }
}
