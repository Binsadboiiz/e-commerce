using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations;

public class SellerAddressConfiguration : IEntityTypeConfiguration<SellerAddress>
{
    public void Configure(EntityTypeBuilder<SellerAddress> builder)
    {
        builder.ToTable("Seller_addresses");

        builder.HasKey(x => x.SellerAddressId);

        builder.HasIndex(x => x.SellerId);

        builder.HasOne(x => x.SellerAccount)
            .WithMany(x => x.Addresses)
            .HasForeignKey(x => x.SellerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}