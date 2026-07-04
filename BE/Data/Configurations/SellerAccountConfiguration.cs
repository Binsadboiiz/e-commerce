using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class SellerAccountConfiguration : IEntityTypeConfiguration<SellerAccount>
    {
        public void Configure(EntityTypeBuilder<SellerAccount> builder)
        {
            builder.ToTable("Seller_accounts");

            builder.HasKey(x => x.SellerId);

            builder.Property(x => x.SellerId)
                .HasMaxLength(50);

            builder.Property(x => x.UserId)
                .HasMaxLength(50)
                .IsRequired();

            builder.HasIndex(x => x.UserId)
                .IsUnique();

            builder.Property(x => x.MaxShopLimit)
                .HasDefaultValue(1);

            builder.HasOne(x => x.User)
                .WithOne(x => x.SellerAccount)
                .HasForeignKey<SellerAccount>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.SellerType)
                .WithMany(x => x.SellerAccounts)
                .HasForeignKey(x => x.SellerTypeId);

            builder.HasOne(x => x.SellerStatus)
                .WithMany(x => x.SellerAccounts)
                .HasForeignKey(x => x.SellerStatusId);

            builder.Property(x => x.CreatedAt);

            builder.Property(x => x.UpdatedAt);
        }
    }
}