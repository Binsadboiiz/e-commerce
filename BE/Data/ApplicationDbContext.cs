using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        //User
        public DbSet<User> Users { get; set; }
        public DbSet<UserAddresses> UserAddressesEnumerable { get; set; }

        //Product
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        //Product Attribute
        public DbSet<AttributeType> AttributeTypes { get; set; }
        public DbSet<AttributeValue> AttributeValues { get; set; }
        public DbSet<ProductAttribute> ProductAttributes { get; set; }
        public DbSet<VariantAttribute> VariantAttributes { get; set; }

        //Shop
        public DbSet<Shop> Shops { get; set; }
        public DbSet<StoreDetail> StoreDetails { get; set; }

        //Brand
        public DbSet<Brand> Brands { get; set; }

        //Category
        public DbSet<Category> Categories { get; set; }

        //Cart
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        //Order
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderTracking> OrderTrackings { get; set; }

        //Shipping
        public DbSet<ShippingDetail>  ShippingDetails { get; set; }

        //Voucher
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<OrderVoucher> OrderVouchers { get; set; }

        //Payment
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }

        //Inventory
        public DbSet<Inventory>  Inventories { get; set; }

        //Account
        public DbSet<Account> Accounts { get; set; }

        //Review
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewImage> ReviewImages { get; set; }
        public DbSet<ReviewReply> ReviewReplies { get; set; }

        //Seller
        public DbSet<SellerAccount> SellerAccounts { get; set; }
        public DbSet<SellerType> SellerTypes { get; set; }
        public DbSet<SellerStatus> SellerStatuses { get; set; }
        public DbSet<SellerAddress> SellerAddresses { get; set; }
        public DbSet<SellerBank> SellerBanks { get; set; }
        public DbSet<SellerBusiness> SellerBusinesses { get; set; }
        public DbSet<SellerDocument> SellerDocuments { get; set; }
        public DbSet<SellerDocumentType> SellerDocumentTypes { get; set; }

        //RedirectRule
        public DbSet<RedirectRule> RedirectRules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            //cấu hình các quan hệ được khai báo ở các file Data.Configurations
        }
    }
}
