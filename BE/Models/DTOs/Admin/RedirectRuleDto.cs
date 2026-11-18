using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs.Admin
{
    public class CreateRedirectRuleDto
    {
        [Required(ErrorMessage = "Source URL is required.")]
        [MaxLength(500, ErrorMessage = "Source URL cannot exceed 500 characters.")]
        public string SourceUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "Target URL is required.")]
        [MaxLength(500, ErrorMessage = "Target URL cannot exceed 500 characters.")]
        public string TargetUrl { get; set; } = string.Empty;

        [Range(300, 399, ErrorMessage = "Status code must be a valid HTTP 3xx redirect status code (301 or 302).")]
        public int StatusCode { get; set; } = 301;

        public bool IsRegex { get; set; } = false;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateRedirectRuleDto
    {
        [Required(ErrorMessage = "Source URL is required.")]
        [MaxLength(500, ErrorMessage = "Source URL cannot exceed 500 characters.")]
        public string SourceUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "Target URL is required.")]
        [MaxLength(500, ErrorMessage = "Target URL cannot exceed 500 characters.")]
        public string TargetUrl { get; set; } = string.Empty;

        [Range(300, 399, ErrorMessage = "Status code must be a valid HTTP 3xx redirect status code (301 or 302).")]
        public int StatusCode { get; set; } = 301;

        public bool IsRegex { get; set; } = false;

        public bool IsActive { get; set; } = true;
    }

    public class RedirectRuleResponseDto
    {
        public int Id { get; set; }
        public string SourceUrl { get; set; } = string.Empty;
        public string TargetUrl { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public bool IsRegex { get; set; }
        public bool IsActive { get; set; }
        public long HitCount { get; set; }
        public DateTime? LastAccessedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
