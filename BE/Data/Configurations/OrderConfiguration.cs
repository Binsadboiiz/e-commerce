using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // Order -> Customer
            builder.HasOne(o => o.Customer)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order -> Address
            builder.HasOne(o => o.UserAddresses)
                .WithMany()
                .HasForeignKey(o => o.AddressId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order -> Items
            builder.HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order -> Trackings
            builder.HasMany(o => o.OrderTrackings)
                .WithOne(t => t.Order)
                .HasForeignKey(t => t.OrderId);

            // Order -> ShippingDetail
            builder.HasOne(o => o.ShippingDetail)
                .WithOne(s => s.Order)
                .HasForeignKey<ShippingDetail>(s => s.OrderId);
        }
    }
}
