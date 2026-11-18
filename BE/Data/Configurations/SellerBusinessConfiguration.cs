using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations;

public class SellerBusinessConfiguration : IEntityTypeConfiguration<SellerBusiness>
{
    public void Configure(EntityTypeBuilder<SellerBusiness> builder)
    {
        builder.ToTable("Seller_businesses");

        builder.HasKey(x => x.BusinessId);

        builder.HasIndex(x => x.SellerId)
            .IsUnique();

        builder.HasOne(x => x.SellerAccount)
            .WithOne(x => x.Business)
            .HasForeignKey<SellerBusiness>(x => x.SellerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}