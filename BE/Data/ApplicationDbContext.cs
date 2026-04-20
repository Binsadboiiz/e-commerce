using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<AttributeType> AttributeTypes { get; set; }
        public DbSet<AttributeValue> AttributeValues { get; set; }
        public DbSet<ProductAttribute> ProductAttributes { get; set; }
        public DbSet<VariantAttribute> VariantAttributes { get; set; }
        public DbSet<Shop> Shops { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<OrderVoucher> OrderVouchers { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User -> Addresses (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId);

            // User -> Cart (one-to-one)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Cart)
                .WithOne(c => c.User)
                .HasForeignKey<Cart>(c => c.UserId);

            // Product -> Retailer
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Retailer)
                .WithMany()
                .HasForeignKey(p => p.RetailerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Product -> Variants (one-to-many)
            modelBuilder.Entity<Product>()
                .HasMany(p => p.Variants)
                .WithOne(v => v.Product)
                .HasForeignKey(v => v.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // CartItem -> Variant (optional)
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Variant)
                .WithMany()
                .HasForeignKey(ci => ci.VariantId)
                .OnDelete(DeleteBehavior.SetNull);

            // Order -> Customer
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order -> Address
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Address)
                .WithMany()
                .HasForeignKey(o => o.AddressId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order -> Items
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Shop)
                .WithMany()
                .HasForeignKey(oi => oi.ShopId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Variant)
                .WithMany()
                .HasForeignKey(oi => oi.VariantId)
                .OnDelete(DeleteBehavior.SetNull);

            // OrderVoucher (many-to-many kiểu manual)
            modelBuilder.Entity<OrderVoucher>()
                .HasOne(ov => ov.Order)
                .WithMany(o => o.OrderVouchers)
                .HasForeignKey(ov => ov.OrderId);

            modelBuilder.Entity<OrderVoucher>()
                .HasOne(ov => ov.Voucher)
                .WithMany(v => v.OrderVouchers)
                .HasForeignKey(ov => ov.VoucherId);

            // PaymentTransaction (1-1)
            modelBuilder.Entity<PaymentTransaction>()
                .HasOne(p => p.Order)
                .WithOne(o => o.PaymentTransaction)
                .HasForeignKey<PaymentTransaction>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
