using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BE.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // User -> Addresses (one-to-many)
            builder.HasMany(u => u.UserAddressesCollection)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId);

            // User -> Cart (one-to-one)
            builder.HasOne(u => u.Cart)
                .WithOne(c => c.User)
                .HasForeignKey<Cart>(c => c.UserId);
        }
    }
}
