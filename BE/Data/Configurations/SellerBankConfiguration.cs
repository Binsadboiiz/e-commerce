using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations;

public class SellerBankConfiguration : IEntityTypeConfiguration<SellerBank>
{
    public void Configure(EntityTypeBuilder<SellerBank> builder)
    {
        builder.ToTable("Seller_banks");

        builder.HasKey(x => x.SellerBankId);

        builder.HasIndex(x => x.SellerId);

        builder.HasOne(x => x.SellerAccount)
            .WithMany(x => x.Banks)
            .HasForeignKey(x => x.SellerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}