using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class SellerTypeConfiguration : IEntityTypeConfiguration<SellerType>
    {
        public void Configure(EntityTypeBuilder<SellerType> builder)
        {
            builder.ToTable("Seller_types");

            builder.HasKey(x => x.SellerTypeId);

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
}