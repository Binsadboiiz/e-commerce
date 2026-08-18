using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    /// <summary>
    /// EF Core Entity Configuration for StoreDetail.
    /// Configures table name, primary key, column limits, and 1-to-1 relationship with Shop.
    /// </summary>
    public class StoreConfiguration : IEntityTypeConfiguration<StoreDetail>
    {
        public void Configure(EntityTypeBuilder<StoreDetail> builder)
        {
            builder.ToTable("StoreDetails");

            builder.HasKey(x => x.ShopId);

            builder.Property(x => x.StoreAddress)
                .HasMaxLength(255);

            builder.Property(x => x.StoreCity)
                .HasMaxLength(100);

            builder.Property(x => x.StoreState)
                .HasMaxLength(50);

            builder.Property(x => x.StoreZipCode)
                .HasMaxLength(20);

            builder.Property(x => x.StorePhone)
                .HasMaxLength(20);

            builder.Property(x => x.StoreEmail)
                .HasMaxLength(100);

            builder.HasOne(x => x.Shop)
                .WithOne(x => x.StoreDetail)
                .HasForeignKey<StoreDetail>(x => x.ShopId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}