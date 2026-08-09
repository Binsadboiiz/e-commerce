-- =========================================================================
-- VELORAMALL OPTIMIZED CONSOLIDATED DATABASE SCHEMA
-- Generated on: 2026-08-09
-- Description: Consolidated schema containing all tables (including base, 
--              seller accounts, and voucher type updates).
-- =========================================================================

CREATE DATABASE IF NOT EXISTS VeloraMall;
USE VeloraMall;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================================
-- 1. USERS
-- =========================================================================
CREATE TABLE Users (
    UserId VARCHAR(50) PRIMARY KEY,
    Email VARCHAR(255) UNIQUE,
    Fullname VARCHAR(255),
    Phone VARCHAR(50) UNIQUE,
    Avatar LONGTEXT,
    IsActive TINYINT DEFAULT 1
);

CREATE INDEX idx_user_email ON Users(Email);


-- =========================================================================
-- 2. USER ADDRESSES
-- =========================================================================
CREATE TABLE User_addresses (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50),
    FullName VARCHAR(255),
    PhoneNumber BIGINT,
    City VARCHAR(100),
    StreetName VARCHAR(255),
    HouseNo VARCHAR(50),
    isDefault TINYINT DEFAULT 0,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE INDEX idx_user_addresses_user ON User_addresses(UserId);


-- =========================================================================
-- 3. SHOPS
-- =========================================================================
CREATE TABLE Shops (
    ShopId BIGINT AUTO_INCREMENT PRIMARY KEY,
    OwnerId VARCHAR(50),
    Name VARCHAR(255),
    Description VARCHAR(500),
    Status ENUM('active', 'inactive', 'banned'),
    Logo LONGTEXT,
    IsActive TINYINT DEFAULT 1,
    Create_At DATE,
    Update_At DATE,
    
    FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
);

CREATE INDEX idx_shops_owner ON Shops(OwnerId);


-- =========================================================================
-- 4. SHOP ADDRESSES
-- =========================================================================
CREATE TABLE Shop_addresses (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ShopId BIGINT,
    City VARCHAR(100),
    StreetName VARCHAR(255),
    HouseNo VARCHAR(50),
    
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId) ON DELETE CASCADE
);

CREATE INDEX idx_shop_addresses_shop ON Shop_addresses(ShopId);


-- =========================================================================
-- 5. BRANDS
-- =========================================================================
CREATE TABLE Brands (
    BrandId BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255)
);


-- =========================================================================
-- 6. CATEGORIES
-- =========================================================================
CREATE TABLE Categories (
    CategoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255)
);


-- =========================================================================
-- 7. PRODUCTS
-- =========================================================================
CREATE TABLE Products (
    ProductId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ShopId BIGINT,
    RetailerId VARCHAR(50),
    Name VARCHAR(255),
    Slug VARCHAR(255) UNIQUE,
    Description TEXT,
    Price DECIMAL(18,2),
    DiscountPrice DECIMAL(18,2),
    Stock INT,
    CategoryId BIGINT,
    BrandId BIGINT,
    Image LONGTEXT,
    RatingAvg FLOAT DEFAULT 0,
    RatingCount BIGINT DEFAULT 0,
    Status ENUM('active', 'inactive', 'out_of_stock', 'deleted') DEFAULT 'active',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId),
    FOREIGN KEY (RetailerId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
    FOREIGN KEY (BrandId) REFERENCES Brands(BrandId)
);

CREATE INDEX idx_products_shop ON Products(ShopId);
CREATE INDEX idx_products_category ON Products(CategoryId);
CREATE INDEX idx_products_brand ON Products(BrandId);
CREATE INDEX idx_products_name ON Products(Name);
CREATE INDEX idx_products_price ON Products(Price);
CREATE INDEX idx_products_status ON Products(Status);


-- =========================================================================
-- 8. PRODUCT VARIANTS
-- =========================================================================
CREATE TABLE Product_variants (
    VariantId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductId BIGINT NOT NULL,
    SKU VARCHAR(100),
    Price DECIMAL(18,2),
    Stock INT DEFAULT 0,
    
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE
);

CREATE INDEX idx_variant_product ON Product_variants(ProductId);


-- =========================================================================
-- 9. PRODUCT IMAGES
-- =========================================================================
CREATE TABLE Product_images (
    ImageId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductId BIGINT NOT NULL,
    VariantId BIGINT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    IsPrimary TINYINT DEFAULT 0,
    SortOrder INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE,
    FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product ON Product_images(ProductId);
CREATE INDEX idx_product_images_variant ON Product_images(VariantId);


-- =========================================================================
-- 10. CARTS
-- =========================================================================
CREATE TABLE Carts (
    CartId BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50) UNIQUE,
    Create_At DATE,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE INDEX idx_cart_user ON Carts(UserId);


-- =========================================================================
-- 11. CART ITEMS
-- =========================================================================
CREATE TABLE Cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    CartId BIGINT,
    Product_id BIGINT,
    VariantId BIGINT NULL,
    Quantity INT DEFAULT 1,

    FOREIGN KEY (CartId) REFERENCES Carts(CartId) ON DELETE CASCADE,
    FOREIGN KEY (Product_id) REFERENCES Products(ProductId) ON DELETE CASCADE,
    FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId) ON DELETE SET NULL
);

CREATE INDEX idx_cart_items_cart ON Cart_items(CartId);
CREATE INDEX idx_cart_items_product ON Cart_items(Product_id);
CREATE INDEX idx_cart_items_variant ON Cart_items(VariantId);


-- =========================================================================
-- 12. ORDERS
-- =========================================================================
CREATE TABLE Orders (
    OrderId BIGINT AUTO_INCREMENT PRIMARY KEY,
    CustomerId VARCHAR(50),
    MerchandiseSubtotal DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    ShippingFee DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    FinalAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    TotalAmount BIGINT,
    Status ENUM('pending', 'processing', 'completed', 'cancelled'),
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(50),
    AddressId BIGINT,
    Create_At DATE,
    EstimatedDeliveryDate DATETIME NULL,

    FOREIGN KEY (CustomerId) REFERENCES Users(UserId),
    CONSTRAINT FK_Orders_UserAddress FOREIGN KEY (AddressId) REFERENCES User_addresses(Id)
);

CREATE INDEX idx_order_customer ON Orders(CustomerId);
CREATE INDEX idx_order_address ON Orders(AddressId);


-- =========================================================================
-- 13. ORDER ITEMS
-- =========================================================================
CREATE TABLE Order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId BIGINT,
    ShopId BIGINT,
    ProductId BIGINT,
    VariantId BIGINT NULL,
    ProductName VARCHAR(255),
    ProductImage LONGTEXT NULL,
    VariantName VARCHAR(255) NULL,
    VariantValue VARCHAR(255) NULL,
    Price DECIMAL(18,2),
    Quantity INT,

    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT FK_OrderItems_ProductVariants FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId) ON DELETE SET NULL
);

CREATE INDEX idx_order_items_order ON Order_items(OrderId);
CREATE INDEX idx_order_items_shop ON Order_items(ShopId);
CREATE INDEX idx_order_items_product ON Order_items(ProductId);
CREATE INDEX idx_order_items_variant ON Order_items(VariantId);


-- =========================================================================
-- 14. PAYMENT TRANSACTIONS
-- =========================================================================
CREATE TABLE PaymentTransactions (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId BIGINT NOT NULL,
    Method VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    TransactionCode VARCHAR(255) NULL,
    PaidAt DATETIME NULL,
    
    CONSTRAINT UQ_PaymentTransactions_OrderId UNIQUE (OrderId),
    CONSTRAINT FK_PaymentTransactions_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE
);


-- =========================================================================
-- 15. VOUCHERS
-- =========================================================================
CREATE TABLE Vouchers (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) NOT NULL,
    DiscountType VARCHAR(20) NOT NULL,
    Value DOUBLE NOT NULL,
    MaxDiscount DOUBLE NULL,
    MinOrderValue DOUBLE NULL,
    ExpiredAt DATETIME NULL,
    IsActive TINYINT(1) NOT NULL DEFAULT 1,
    VoucherType VARCHAR(20) NOT NULL DEFAULT 'AllItems',
    CategoryId BIGINT NULL,
    ShopId BIGINT NULL,
    UsageLimit INT NULL,
    UsageCount INT NOT NULL DEFAULT 0,
    
    CONSTRAINT UQ_Vouchers_Code UNIQUE (Code),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId) ON DELETE SET NULL,
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId) ON DELETE CASCADE
);


-- =========================================================================
-- 16. ORDER VOUCHERS
-- =========================================================================
CREATE TABLE Order_Vouchers (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId BIGINT NOT NULL,
    VoucherId BIGINT NOT NULL,
    
    CONSTRAINT FK_OrderVouchers_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderVouchers_Vouchers FOREIGN KEY (VoucherId) REFERENCES Vouchers(Id) ON DELETE RESTRICT
);

CREATE INDEX idx_order_vouchers_order ON Order_Vouchers(OrderId);
CREATE INDEX idx_order_vouchers_voucher ON Order_Vouchers(VoucherId);


-- =========================================================================
-- 17. ORDER TRACKING
-- =========================================================================
CREATE TABLE Order_Tracking (
    OrderTrackingId BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId         BIGINT       NOT NULL,
    Status          VARCHAR(50)  NOT NULL,
    Location        VARCHAR(255) NULL,
    Description     VARCHAR(500) NULL,
    UpdatedBy       VARCHAR(50)  NULL,
    CreatedAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tracking_order ON Order_Tracking(OrderId);
CREATE INDEX idx_tracking_status ON Order_Tracking(Status);


-- =========================================================================
-- 18. SHIPPING DETAILS
-- =========================================================================
CREATE TABLE Shipping_Details (
    Id                    BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    OrderId               BIGINT       NOT NULL,
    Carrier               VARCHAR(100) NULL,
    TrackingCode          VARCHAR(100) NULL,
    CurrentLocation       VARCHAR(255) NULL,
    Status                VARCHAR(50)  NULL,
    ShipperId             VARCHAR(50)  NULL,
    EstimatedDeliveryDate DATETIME     NULL,
    UpdatedAt             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_shipping_order (OrderId),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================================
-- 19. ATTRIBUTES
-- =========================================================================
CREATE TABLE Attributes (
    AttributeId BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL   
);


-- =========================================================================
-- 20. ATTRIBUTE VALUES
-- =========================================================================
CREATE TABLE Attribute_values (
    ValueId BIGINT AUTO_INCREMENT PRIMARY KEY,
    AttributeId BIGINT NOT NULL,
    Value VARCHAR(100) NOT NULL, 

    FOREIGN KEY (AttributeId) REFERENCES Attributes(AttributeId) ON DELETE CASCADE
);

CREATE INDEX idx_attr_value ON Attribute_values(Value);
CREATE INDEX idx_attr_type ON Attribute_values(AttributeId);


-- =========================================================================
-- 21. PRODUCT ATTRIBUTES
-- =========================================================================
CREATE TABLE Product_attributes (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductId BIGINT NOT NULL,
    ValueId BIGINT NOT NULL,

    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE,
    FOREIGN KEY (ValueId) REFERENCES Attribute_values(ValueId) ON DELETE CASCADE
);

CREATE INDEX idx_product_attr_product ON Product_attributes(ProductId);
CREATE INDEX idx_product_attr_value ON Product_attributes(ValueId);


-- =========================================================================
-- 22. VARIANT ATTRIBUTES
-- =========================================================================
CREATE TABLE Variant_attributes (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    VariantId BIGINT NOT NULL,
    ValueId BIGINT NOT NULL,

    FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId) ON DELETE CASCADE,
    FOREIGN KEY (ValueId) REFERENCES Attribute_values(ValueId) ON DELETE CASCADE,
    CONSTRAINT UQ_Variant_Value UNIQUE (VariantId, ValueId)
);

CREATE INDEX idx_variant_attr_variant ON Variant_attributes(VariantId);
CREATE INDEX idx_variant_attr_value ON Variant_attributes(ValueId);


-- =========================================================================
-- 23. INVENTORIES
-- =========================================================================
CREATE TABLE Inventories (
    InventoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductVariantId BIGINT NOT NULL,
    AvailableStock INT NOT NULL DEFAULT 0 CHECK (AvailableStock >= 0),
    ReservedStock INT NOT NULL DEFAULT 0 CHECK (ReservedStock >= 0),
    SoldStock INT NOT NULL DEFAULT 0 CHECK (SoldStock >= 0),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Inventories_ProductVariants FOREIGN KEY (ProductVariantId) REFERENCES Product_variants(VariantId) ON DELETE CASCADE,
    CONSTRAINT UQ_Inventories_ProductVariant UNIQUE(ProductVariantId)
);

CREATE INDEX idx_inventories_variant ON Inventories(ProductVariantId);


-- =========================================================================
-- 24. ACCOUNTS
-- =========================================================================
CREATE TABLE Accounts (
    AccountId BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50) NOT NULL,
    Username VARCHAR(100) UNIQUE NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(500) NOT NULL,
    OldPasswordHash VARCHAR(500) NULL,
    Role VARCHAR(50) NOT NULL,
    RefreshToken VARCHAR(1000) NULL,
    RefreshTokenExpiry DATETIME NULL,
    IsVerified TINYINT(1) DEFAULT 0,
    IsActive TINYINT(1) DEFAULT 1,
    LastLoginAt DATETIME NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Accounts_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE INDEX idx_accounts_email ON Accounts(Email);
CREATE INDEX idx_accounts_role ON Accounts(Role);


-- =========================================================================
-- 25. REVIEWS
-- =========================================================================
CREATE TABLE Reviews (
    ReviewId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductId BIGINT NOT NULL,
    UserId VARCHAR(50) NOT NULL,
    OrderItemId BIGINT NULL,
    Rating TINYINT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Content TEXT NOT NULL,
    IsHidden TINYINT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_product ON Reviews(ProductId);
CREATE INDEX idx_reviews_user ON Reviews(UserId);
CREATE INDEX idx_reviews_rating ON Reviews(ProductId, Rating);
CREATE INDEX idx_reviews_created ON Reviews(ProductId, CreatedAt);


-- =========================================================================
-- 26. REVIEW IMAGES
-- =========================================================================
CREATE TABLE Review_Images (
    ReviewImageId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ReviewId BIGINT NOT NULL,
    ImageUrl LONGTEXT NOT NULL,
    SortOrder INT DEFAULT 0,

    FOREIGN KEY (ReviewId) REFERENCES Reviews(ReviewId) ON DELETE CASCADE
);


-- =========================================================================
-- 27. REVIEW REPLIES
-- =========================================================================
CREATE TABLE Review_Replies (
    ReplyId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ReviewId BIGINT NOT NULL UNIQUE,
    ShopId BIGINT NOT NULL,
    Content TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ReviewId) REFERENCES Reviews(ReviewId) ON DELETE CASCADE,
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId) ON DELETE CASCADE
);


-- =========================================================================
-- 28. SELLER TYPES
-- =========================================================================
CREATE TABLE Seller_types (
    SellerTypeId INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    DisplayOrder INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================================
-- 29. SELLER STATUSES
-- =========================================================================
CREATE TABLE Seller_statuses (
    SellerStatusId INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    DisplayOrder INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================================
-- 30. SELLER ACCOUNTS
-- =========================================================================
CREATE TABLE Seller_accounts (
    SellerId VARCHAR(50) PRIMARY KEY,
    UserId VARCHAR(50) NOT NULL UNIQUE,
    SellerTypeId INT NOT NULL,
    SellerStatusId INT NOT NULL,
    MaxShopLimit INT DEFAULT 1,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerAccounts_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,
    CONSTRAINT FK_SellerAccounts_SellerTypes
        FOREIGN KEY (SellerTypeId)
        REFERENCES Seller_types(SellerTypeId),
    CONSTRAINT FK_SellerAccounts_SellerStatuses
        FOREIGN KEY (SellerStatusId)
        REFERENCES Seller_statuses(SellerStatusId)
);

CREATE INDEX idx_seller_user ON Seller_accounts(UserId);
CREATE INDEX idx_seller_status ON Seller_accounts(SellerStatusId);


-- =========================================================================
-- 31. SELLER ADDRESSES
-- =========================================================================
CREATE TABLE Seller_addresses (
    SellerAddressId BIGINT AUTO_INCREMENT PRIMARY KEY,
    SellerId VARCHAR(50) NOT NULL,
    FullName VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    City VARCHAR(100),
    District VARCHAR(100),
    Ward VARCHAR(100),
    StreetAddress VARCHAR(255),
    PostalCode VARCHAR(20),
    IsDefault BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerAddresses_SellerAccounts
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE
);

CREATE INDEX idx_seller_address ON Seller_addresses(SellerId);


-- =========================================================================
-- 32. SELLER DOCUMENT TYPES
-- =========================================================================
CREATE TABLE Seller_document_types (
    DocumentTypeId INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) UNIQUE,
    Name VARCHAR(100),
    Description VARCHAR(255),
    DisplayOrder INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE
);


-- =========================================================================
-- 33. SELLER DOCUMENTS
-- =========================================================================
CREATE TABLE Seller_documents (
    DocumentId BIGINT AUTO_INCREMENT PRIMARY KEY,
    SellerId VARCHAR(50) NOT NULL,
    DocumentTypeId INT NOT NULL,
    FileUrl LONGTEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerDocuments_Seller
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE,
    CONSTRAINT FK_SellerDocuments_DocumentType
        FOREIGN KEY (DocumentTypeId)
        REFERENCES Seller_document_types(DocumentTypeId)
);

CREATE INDEX idx_seller_document ON Seller_documents(SellerId);


-- =========================================================================
-- 34. SELLER BUSINESSES
-- =========================================================================
CREATE TABLE Seller_businesses (
    BusinessId BIGINT AUTO_INCREMENT PRIMARY KEY,
    SellerId VARCHAR(50) NOT NULL UNIQUE,
    CompanyName VARCHAR(255),
    TaxCode VARCHAR(100),
    BusinessLicenseNumber VARCHAR(100),
    Representative VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerBusinesses_Seller
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE
);


-- =========================================================================
-- 35. SELLER BANKS
-- =========================================================================
CREATE TABLE Seller_banks (
    SellerBankId BIGINT AUTO_INCREMENT PRIMARY KEY,
    SellerId VARCHAR(50) NOT NULL,
    BankCode VARCHAR(50),
    AccountNumber VARCHAR(100),
    AccountName VARCHAR(255),
    IsPrimary BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerBanks_Seller
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE
);

CREATE INDEX idx_seller_bank ON Seller_banks(SellerId);

SET FOREIGN_KEY_CHECKS = 1;
