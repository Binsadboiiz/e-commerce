using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations;

public class SellerStatusConfiguration : IEntityTypeConfiguration<SellerStatus>
{
    public void Configure(EntityTypeBuilder<SellerStatus> builder)
    {
        builder.ToTable("Seller_statuses");

        builder.HasKey(x => x.SellerStatusId);

        builder.HasIndex(x => x.Code)
            .IsUnique();

        builder.Property(x => x.Code)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(255);
    }
}