using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRedirectRulesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CategoryId",
                table: "Vouchers",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ShopId",
                table: "Vouchers",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsageCount",
                table: "Vouchers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsageLimit",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VoucherType",
                table: "Vouchers",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<long>(
                name: "PhoneNumber",
                table: "User_addresses",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Logo",
                table: "Shops",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "SKU",
                table: "Product_variants",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Product_variants",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ShopId",
                table: "Order_Tracking",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SellerStatus",
                table: "Order_items",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RedirectRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SourceUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TargetUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StatusCode = table.Column<int>(type: "int", nullable: false, defaultValue: 301),
                    IsRegex = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    HitCount = table.Column<long>(type: "bigint", nullable: false, defaultValue: 0L),
                    LastAccessedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RedirectRules", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ReviewId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProductId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderItemId = table.Column<long>(type: "bigint", nullable: true),
                    Rating = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsHidden = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.ReviewId);
                    table.ForeignKey(
                        name: "FK_Reviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_document_types",
                columns: table => new
                {
                    DocumentTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_document_types", x => x.DocumentTypeId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_statuses",
                columns: table => new
                {
                    SellerStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_statuses", x => x.SellerStatusId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_types",
                columns: table => new
                {
                    SellerTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_types", x => x.SellerTypeId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StoreDetails",
                columns: table => new
                {
                    ShopId = table.Column<long>(type: "bigint", nullable: false),
                    StoreAddress = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StoreCity = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StoreState = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StoreZipCode = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StorePhone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StoreEmail = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreDetails", x => x.ShopId);
                    table.ForeignKey(
                        name: "FK_StoreDetails_Shops_ShopId",
                        column: x => x.ShopId,
                        principalTable: "Shops",
                        principalColumn: "ShopId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Review_Images",
                columns: table => new
                {
                    ReviewImageId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ReviewId = table.Column<long>(type: "bigint", nullable: false),
                    ImageUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Review_Images", x => x.ReviewImageId);
                    table.ForeignKey(
                        name: "FK_Review_Images_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "ReviewId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Review_Replies",
                columns: table => new
                {
                    ReplyId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ReviewId = table.Column<long>(type: "bigint", nullable: false),
                    ShopId = table.Column<long>(type: "bigint", nullable: false),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Review_Replies", x => x.ReplyId);
                    table.ForeignKey(
                        name: "FK_Review_Replies_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "ReviewId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Review_Replies_Shops_ShopId",
                        column: x => x.ShopId,
                        principalTable: "Shops",
                        principalColumn: "ShopId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_accounts",
                columns: table => new
                {
                    SellerId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SellerTypeId = table.Column<int>(type: "int", nullable: false),
                    SellerStatusId = table.Column<int>(type: "int", nullable: false),
                    MaxShopLimit = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_accounts", x => x.SellerId);
                    table.ForeignKey(
                        name: "FK_Seller_accounts_Seller_statuses_SellerStatusId",
                        column: x => x.SellerStatusId,
                        principalTable: "Seller_statuses",
                        principalColumn: "SellerStatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Seller_accounts_Seller_types_SellerTypeId",
                        column: x => x.SellerTypeId,
                        principalTable: "Seller_types",
                        principalColumn: "SellerTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Seller_accounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_addresses",
                columns: table => new
                {
                    SellerAddressId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SellerId = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FullName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    City = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    District = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ward = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StreetAddress = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PostalCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsDefault = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_addresses", x => x.SellerAddressId);
                    table.ForeignKey(
                        name: "FK_Seller_addresses_Seller_accounts_SellerId",
                        column: x => x.SellerId,
                        principalTable: "Seller_accounts",
                        principalColumn: "SellerId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_banks",
                columns: table => new
                {
                    SellerBankId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SellerId = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BankCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AccountNumber = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AccountName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsPrimary = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_banks", x => x.SellerBankId);
                    table.ForeignKey(
                        name: "FK_Seller_banks_Seller_accounts_SellerId",
                        column: x => x.SellerId,
                        principalTable: "Seller_accounts",
                        principalColumn: "SellerId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_businesses",
                columns: table => new
                {
                    BusinessId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SellerId = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CompanyName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TaxCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BusinessLicenseNumber = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Representative = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_businesses", x => x.BusinessId);
                    table.ForeignKey(
                        name: "FK_Seller_businesses_Seller_accounts_SellerId",
                        column: x => x.SellerId,
                        principalTable: "Seller_accounts",
                        principalColumn: "SellerId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seller_documents",
                columns: table => new
                {
                    DocumentId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SellerId = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DocumentTypeId = table.Column<int>(type: "int", nullable: false),
                    FileUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seller_documents", x => x.DocumentId);
                    table.ForeignKey(
                        name: "FK_Seller_documents_Seller_accounts_SellerId",
                        column: x => x.SellerId,
                        principalTable: "Seller_accounts",
                        principalColumn: "SellerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Seller_documents_Seller_document_types_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "Seller_document_types",
                        principalColumn: "DocumentTypeId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_CategoryId",
                table: "Vouchers",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_ShopId",
                table: "Vouchers",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Tracking_ShopId",
                table: "Order_Tracking",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_RedirectRules_IsActive",
                table: "RedirectRules",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_RedirectRules_SourceUrl",
                table: "RedirectRules",
                column: "SourceUrl",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Review_Images_ReviewId",
                table: "Review_Images",
                column: "ReviewId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_Replies_ReviewId",
                table: "Review_Replies",
                column: "ReviewId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Review_Replies_ShopId",
                table: "Review_Replies",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProductId",
                table: "Reviews",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_accounts_SellerStatusId",
                table: "Seller_accounts",
                column: "SellerStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_accounts_SellerTypeId",
                table: "Seller_accounts",
                column: "SellerTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_accounts_UserId",
                table: "Seller_accounts",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seller_addresses_SellerId",
                table: "Seller_addresses",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_banks_SellerId",
                table: "Seller_banks",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_businesses_SellerId",
                table: "Seller_businesses",
                column: "SellerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seller_document_types_Code",
                table: "Seller_document_types",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seller_documents_DocumentTypeId",
                table: "Seller_documents",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_documents_SellerId",
                table: "Seller_documents",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_Seller_statuses_Code",
                table: "Seller_statuses",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seller_types_Code",
                table: "Seller_types",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Tracking_Shops_ShopId",
                table: "Order_Tracking",
                column: "ShopId",
                principalTable: "Shops",
                principalColumn: "ShopId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vouchers_Categories_CategoryId",
                table: "Vouchers",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vouchers_Shops_ShopId",
                table: "Vouchers",
                column: "ShopId",
                principalTable: "Shops",
                principalColumn: "ShopId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Tracking_Shops_ShopId",
                table: "Order_Tracking");

            migrationBuilder.DropForeignKey(
                name: "FK_Vouchers_Categories_CategoryId",
                table: "Vouchers");

            migrationBuilder.DropForeignKey(
                name: "FK_Vouchers_Shops_ShopId",
                table: "Vouchers");

            migrationBuilder.DropTable(
                name: "RedirectRules");

            migrationBuilder.DropTable(
                name: "Review_Images");

            migrationBuilder.DropTable(
                name: "Review_Replies");

            migrationBuilder.DropTable(
                name: "Seller_addresses");

            migrationBuilder.DropTable(
                name: "Seller_banks");

            migrationBuilder.DropTable(
                name: "Seller_businesses");

            migrationBuilder.DropTable(
                name: "Seller_documents");

            migrationBuilder.DropTable(
                name: "StoreDetails");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Seller_accounts");

            migrationBuilder.DropTable(
                name: "Seller_document_types");

            migrationBuilder.DropTable(
                name: "Seller_statuses");

            migrationBuilder.DropTable(
                name: "Seller_types");

            migrationBuilder.DropIndex(
                name: "IX_Vouchers_CategoryId",
                table: "Vouchers");

            migrationBuilder.DropIndex(
                name: "IX_Vouchers_ShopId",
                table: "Vouchers");

            migrationBuilder.DropIndex(
                name: "IX_Order_Tracking_ShopId",
                table: "Order_Tracking");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "ShopId",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "UsageCount",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "UsageLimit",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "VoucherType",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "ShopId",
                table: "Order_Tracking");

            migrationBuilder.DropColumn(
                name: "SellerStatus",
                table: "Order_items");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Phone",
                keyValue: null,
                column: "Phone",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Avatar",
                keyValue: null,
                column: "Avatar",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "User_addresses",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Shops",
                keyColumn: "Logo",
                keyValue: null,
                column: "Logo",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Logo",
                table: "Shops",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "SKU",
                table: "Product_variants",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Product_variants",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);
        }
    }
}
