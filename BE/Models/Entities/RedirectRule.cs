using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities;

[Table("RedirectRules")]
public class RedirectRule
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string SourceUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string TargetUrl { get; set; } = string.Empty;

    public int StatusCode { get; set; } = 301;

    public bool IsRegex { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public long HitCount { get; set; } = 0;

    public DateTime? LastAccessedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}