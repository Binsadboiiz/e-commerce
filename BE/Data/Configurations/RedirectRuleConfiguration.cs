using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class RedirectRuleConfiguration : IEntityTypeConfiguration<RedirectRule>
    {
        public void Configure(EntityTypeBuilder<RedirectRule> builder)
        {
            builder.HasIndex(r => r.SourceUrl).IsUnique();
            
            builder.HasIndex(r => r.IsActive);

            builder.Property(r => r.SourceUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(r => r.TargetUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(r => r.StatusCode)
                .HasDefaultValue(301);

            builder.Property(r => r.IsRegex)
                .HasDefaultValue(false);

            builder.Property(r => r.IsActive)
                .HasDefaultValue(true);

            builder.Property(r => r.HitCount)
                .HasDefaultValue(0);

            builder.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(r => r.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}