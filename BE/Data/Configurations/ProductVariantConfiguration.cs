using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            // ProductVariant -> Inventory (one-to-one)
            builder.HasOne(v => v.Inventory)
                .WithOne(i => i.ProductVariant)
                .HasForeignKey<Inventory>(i => i.ProductVariantId);
        }
    }
}
