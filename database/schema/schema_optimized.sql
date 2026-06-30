-- =========================================================================
-- VELORAMALL OPTIMIZED DATABASE SCHEMA
-- Generated on: 2026-05-27
-- Description: This file contains the consolidated, final database schema.
--              All incremental modifications (ALTER, RENAME, column drops)
--              have been merged directly into the initial CREATE TABLE statements.
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
    Image LONGTEXT, -- URL to primary product image
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
    UserId VARCHAR(50) UNIQUE, -- one cart per user
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
    TotalAmount BIGINT, -- Kept for backward compatibility
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
    
    CONSTRAINT UQ_Vouchers_Code UNIQUE (Code)
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
    Status          VARCHAR(50)  NOT NULL, -- pending, confirmed, preparing, shipped, in_transit, out_for_delivery, delivered, delivery_failed, cancelled
    Location        VARCHAR(255) NULL,
    Description     VARCHAR(500) NULL,
    UpdatedBy       VARCHAR(50)  NULL, -- shop / carrier / system
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
    Carrier               VARCHAR(100) NULL, -- GHN, GHTK, J&T, ...
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
-- SEED DATA (MOCK DATA FOR TESTING)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing data to ensure seed scripts can be run multiple times
TRUNCATE TABLE Accounts;
TRUNCATE TABLE Review_Replies;
TRUNCATE TABLE Review_Images;
TRUNCATE TABLE Reviews;
TRUNCATE TABLE Inventories;
TRUNCATE TABLE Variant_attributes;
TRUNCATE TABLE Product_attributes;
TRUNCATE TABLE Attribute_values;
TRUNCATE TABLE Attributes;
TRUNCATE TABLE Shipping_Details;
TRUNCATE TABLE Order_Tracking;
TRUNCATE TABLE Order_Vouchers;
TRUNCATE TABLE Vouchers;
TRUNCATE TABLE PaymentTransactions;
TRUNCATE TABLE Order_items;
TRUNCATE TABLE Orders;
TRUNCATE TABLE Cart_items;
TRUNCATE TABLE Carts;
TRUNCATE TABLE Product_images;
TRUNCATE TABLE Product_variants;
TRUNCATE TABLE Products;
TRUNCATE TABLE Categories;
TRUNCATE TABLE Brands;
TRUNCATE TABLE Shop_addresses;
TRUNCATE TABLE Shops;
TRUNCATE TABLE User_addresses;
TRUNCATE TABLE Users;

-- 1. Users
INSERT INTO Users (UserId, Email, Fullname, Phone, Avatar, IsActive) VALUES
('usr_admin', 'admin@veloramall.com', 'System Administrator', '0901234567', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 1),
('usr_seller_1', 'apple_store@veloramall.com', 'Apple Premium Reseller', '0912345678', 'https://api.dicebear.com/7.x/avataaars/svg?seed=apple', 1),
('usr_seller_2', 'coolmate@veloramall.com', 'Coolmate Store', '0923456789', 'https://api.dicebear.com/7.x/avataaars/svg?seed=coolmate', 1),
('usr_seller_3', 'sony_center@veloramall.com', 'Sony Center Vietnam', '0934567890', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sony', 1),
('usr_cust_1', 'nguyen.van.a@gmail.com', 'Nguyen Van A', '0945678901', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana', 1),
('usr_cust_2', 'tran.thi.b@gmail.com', 'Tran Thi B', '0956789012', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tranthib', 1),
('usr_cust_3', 'le.van.c@gmail.com', 'Le Van C', '0967890123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=levanc', 1),
('usr_cust_4', 'pham.thi.d@gmail.com', 'Pham Thi D', '0978901234', 'https://api.dicebear.com/7.x/avataaars/svg?seed=phamthid', 1),
('usr_cust_5', 'hoang.van.e@gmail.com', 'Hoang Van E', '0989012345', 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoangvane', 1),
('usr_cust_6', 'bui.thi.f@gmail.com', 'Bui Thi F', '0990123456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=buithif', 0);

-- 2. User Addresses
INSERT INTO User_addresses (Id, UserId, FullName, PhoneNumber, City, StreetName, HouseNo, isDefault) VALUES
(1, 'usr_cust_1', 'Nguyen Van A', 945678901, 'Ho Chi Minh City', 'Nguyen Hue Street', '123/45', 1),
(2, 'usr_cust_1', 'Nguyen Van A Office', 945678901, 'Binh Duong', 'Dai Lo Binh Duong', '789', 0),
(3, 'usr_cust_2', 'Tran Thi B', 956789012, 'Ha Noi', 'Hoan Kiem Lake Side', '12B', 1),
(4, 'usr_cust_3', 'Le Van C', 967890123, 'Da Nang', 'Vo Nguyen Giap Street', '45', 1),
(5, 'usr_cust_4', 'Pham Thi D', 978901234, 'Can Tho', '3 Thang 2 Street', '101A', 1),
(6, 'usr_cust_5', 'Hoang Van E', 989012345, 'Hai Phong', 'Le Hong Phong', '55/2', 1);

-- 3. Shops
INSERT INTO Shops (ShopId, OwnerId, Name, Description, Status, Logo, IsActive, Create_At, Update_At) VALUES
(1, 'usr_seller_1', 'Apple Premium Store', 'Official reseller of Apple products in Vietnam', 'active', 'https://logo.clearbit.com/apple.com', 1, '2026-01-15', '2026-05-20'),
(2, 'usr_seller_2', 'Coolmate Official Store', 'Premium mens activewear and essentials', 'active', 'https://logo.clearbit.com/coolmate.me', 1, '2026-02-10', '2026-05-22'),
(3, 'usr_seller_3', 'Sony Center Authorized', 'Sony official electronics, cameras, and audio products', 'active', 'https://logo.clearbit.com/sony.com.vn', 1, '2026-03-01', '2026-05-25');

-- 4. Shop Addresses
INSERT INTO Shop_addresses (Id, ShopId, City, StreetName, HouseNo) VALUES
(1, 1, 'Ho Chi Minh City', 'Dong Khoi Street', 'Metropolitan Building 235'),
(2, 2, 'Ha Noi', 'Nguyen Trai Street', 'Warehouse 12'),
(3, 3, 'Ho Chi Minh City', 'Tran Hung Dao Street', '456');

-- 5. Brands
INSERT INTO Brands (BrandId, Name) VALUES
(1, 'Apple'),
(2, 'Coolmate'),
(3, 'Sony'),
(4, 'Samsung'),
(5, 'Nike'),
(6, 'Adidas'),
(7, 'Logitech');

-- 6. Categories
INSERT INTO Categories (CategoryId, type) VALUES
(1, 'Smartphones & Tablets'),
(2, 'Laptops & Computers'),
(3, 'Men\'s Fashion'),
(4, 'Audio & Headphones'),
(5, 'Cameras & Accessories'),
(6, 'Sports Gear');

-- 7. Products
INSERT INTO Products (ProductId, ShopId, RetailerId, Name, Slug, Description, Price, DiscountPrice, Stock, CategoryId, BrandId, Image, RatingAvg, RatingCount, Status) VALUES
(1, 1, 'usr_seller_1', 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'The latest titanium iPhone with A17 Pro chip and professional camera system.', 34990000.00, 31990000.00, 150, 1, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 4.8, 120, 'active'),
(2, 1, 'usr_seller_1', 'MacBook Pro 14 M3', 'macbook-pro-14-m3', 'MacBook Pro with Apple M3 chip, 8-core CPU, 10-core GPU, 14.2-inch Liquid Retina XDR display.', 42990000.00, 39990000.00, 50, 2, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 4.9, 45, 'active'),
(3, 1, 'usr_seller_1', 'iPad Air 5 M1', 'ipad-air-5-m1', 'Light. Bright. Full of might. Supercharged by the Apple M1 chip.', 16990000.00, 15490000.00, 80, 1, 1, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 4.7, 88, 'active'),
(4, 2, 'usr_seller_2', 'Coolmate Active T-Shirt', 'coolmate-active-t-shirt', 'Quick-dry activewear T-shirt for sports and daily workouts. Breathable fabric.', 189000.00, 149000.00, 500, 3, 2, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 4.5, 310, 'active'),
(5, 2, 'usr_seller_2', 'Coolmate Running Shorts', 'coolmate-running-shorts', 'Lightweight and elastic training shorts with zipper pockets.', 229000.00, 189000.00, 300, 3, 2, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', 4.6, 195, 'active'),
(6, 2, 'usr_seller_2', 'Coolmate Men Bamboo Socks Pack', 'coolmate-bamboo-socks-pack', 'Pack of 3 premium bamboo fiber socks, odor-resistant and soft.', 129000.00, 99000.00, 1000, 3, 2, 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500', 4.4, 420, 'active'),
(7, 3, 'usr_seller_3', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise-canceling over-ear wireless headphones with premium sound quality.', 8490000.00, 7990000.00, 100, 4, 3, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4.9, 215, 'active'),
(8, 3, 'usr_seller_3', 'Sony WF-1000XM5 Earbuds', 'sony-wf-1000xm5-earbuds', 'The Best Truly Wireless Noise-Cancelling Earbuds with Astonishing Sound Quality.', 5990000.00, 5490000.00, 120, 4, 3, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 4.6, 94, 'active'),
(9, 3, 'usr_seller_3', 'Sony Alpha 7 IV Mirrorless Camera', 'sony-alpha-7-iv', 'An all-arounder with a 33MP Exmor R CMOS sensor and advanced real-time tracking autofocus.', 59990000.00, 57990000.00, 15, 5, 3, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', 4.9, 32, 'active'),
(10, 1, 'usr_seller_1', 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Experience AI-driven performance, a 200MP camera, and built-in S Pen.', 31990000.00, 28990000.00, 90, 1, 4, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 4.7, 85, 'active'),
(11, 2, 'usr_seller_2', 'Nike Air Max Running Shoes', 'nike-air-max-running-shoes', 'Classic Air Max comfort and style with modern performance engineering.', 3500000.00, 2990000.00, 60, 6, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 4.8, 140, 'active'),
(12, 2, 'usr_seller_2', 'Adidas Ultraboost 22', 'adidas-ultraboost-22', 'Responsive running shoes designed with ocean plastic recycled fibers.', 4500000.00, 3800000.00, 80, 6, 6, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', 4.9, 160, 'active'),
(13, 3, 'usr_seller_3', 'Logitech MX Master 3S Mouse', 'logitech-mx-master-3s', 'Ergonomic wireless mouse with 8K DPI tracking and ultra-quiet clicks.', 2490000.00, 2190000.00, 110, 2, 7, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', 4.9, 210, 'active');

-- 8. Product Variants
INSERT INTO Product_variants (VariantId, ProductId, SKU, Price, Stock) VALUES
-- iPhone 15 Pro Max (ProductId = 1)
(1, 1, 'AP-IP15PM-256-BLK', 31990000.00, 50),
(2, 1, 'AP-IP15PM-512-BLK', 37990000.00, 30),
(3, 1, 'AP-IP15PM-256-NAT', 31990000.00, 40),
(4, 1, 'AP-IP15PM-512-NAT', 37990000.00, 30),
-- MacBook Pro 14 M3 (ProductId = 2)
(5, 2, 'AP-MBP14M3-8-512-GRY', 39990000.00, 25),
(6, 2, 'AP-MBP14M3-16-512-GRY', 45990000.00, 25),
-- iPad Air 5 M1 (ProductId = 3)
(7, 3, 'AP-IPAIR5-64-BLU', 15490000.00, 45),
(8, 3, 'AP-IPAIR5-256-BLU', 19490000.00, 35),
-- Coolmate Active T-Shirt (ProductId = 4)
(9, 4, 'CM-ATS-BLK-S', 149000.00, 100),
(10, 4, 'CM-ATS-BLK-M', 149000.00, 150),
(11, 4, 'CM-ATS-BLK-L', 149000.00, 150),
(12, 4, 'CM-ATS-BLU-S', 149000.00, 50),
(13, 4, 'CM-ATS-BLU-M', 149000.00, 50),
-- Coolmate Running Shorts (ProductId = 5)
(14, 5, 'CM-RS-BLK-S', 189000.00, 100),
(15, 5, 'CM-RS-BLK-M', 189000.00, 100),
(16, 5, 'CM-RS-BLK-L', 189000.00, 100),
-- Coolmate Men Bamboo Socks Pack (ProductId = 6)
(17, 6, 'CM-BS-PACK-DEFAULT', 99000.00, 1000),
-- Sony WH-1000XM5 (ProductId = 7)
(18, 7, 'SO-WH5-BLK', 7990000.00, 60),
(19, 7, 'SO-WH5-SLV', 7990000.00, 40),
-- Sony WF-1000XM5 Earbuds (ProductId = 8)
(20, 8, 'SO-WF5-BLK', 5490000.00, 70),
(21, 8, 'SO-WF5-SLV', 5490000.00, 50),
-- Sony Alpha 7 IV Mirrorless Camera (ProductId = 9)
(22, 9, 'SO-A7M4-BODY', 57990000.00, 10),
(23, 9, 'SO-A7M4-KIT2870', 64990000.00, 5),
-- Samsung Galaxy S24 Ultra (ProductId = 10)
(24, 10, 'SS-S24U-256-GRY', 28990000.00, 50),
(25, 10, 'SS-S24U-512-GRY', 34990000.00, 40),
-- Nike Air Max Running Shoes (ProductId = 11)
(26, 11, 'NK-AM-40', 2990000.00, 20),
(27, 11, 'NK-AM-41', 2990000.00, 20),
(28, 11, 'NK-AM-42', 2990000.00, 20),
-- Adidas Ultraboost 22 (ProductId = 12)
(29, 12, 'AD-UB22-41', 3800000.00, 40),
(30, 12, 'AD-UB22-42', 3800000.00, 40),
-- Logitech MX Master 3S Mouse (ProductId = 13)
(31, 13, 'LT-MXM3S-BLK', 2190000.00, 60),
(32, 13, 'LT-MXM3S-WHT', 2190000.00, 50);

-- 9. Product Images
INSERT INTO Product_images (ImageId, ProductId, VariantId, ImageUrl, IsPrimary, SortOrder) VALUES
(1, 1, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 1, 1),
(2, 1, 2, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 0, 2),
(3, 1, 3, 'https://images.unsplash.com/photo-1695048132800-4752b575a02e?w=500', 0, 3),
(4, 2, 5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1, 1),
(5, 4, 9, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 1, 1),
(6, 4, 12, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', 0, 2),
(7, 7, 18, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1, 1),
(8, 7, 19, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500', 0, 2);

-- 10. Carts
INSERT INTO Carts (CartId, UserId, Create_At) VALUES
(1, 'usr_cust_1', '2026-06-25'),
(2, 'usr_cust_2', '2026-06-26'),
(3, 'usr_cust_3', '2026-06-26');

-- 11. Cart Items
INSERT INTO Cart_items (id, CartId, Product_id, VariantId, Quantity) VALUES
(1, 1, 1, 1, 1),
(2, 1, 4, 10, 2),
(3, 2, 7, 18, 1),
(4, 3, 13, 31, 1);

-- 12. Orders
INSERT INTO Orders (OrderId, CustomerId, MerchandiseSubtotal, ShippingFee, DiscountAmount, FinalAmount, TotalAmount, Status, PaymentMethod, PaymentStatus, AddressId, Create_At, EstimatedDeliveryDate) VALUES
(1, 'usr_cust_1', 31990000.00, 50000.00, 50000.00, 31990000.00, 31990000, 'completed', 'COD', 'paid', 1, '2026-06-10', '2026-06-14 18:00:00'),
(2, 'usr_cust_2', 825000.00, 30000.00, 0.00, 855000.00, 855000, 'pending', 'COD', 'unpaid', 3, '2026-06-25', '2026-06-29 18:00:00'),
(3, 'usr_cust_3', 7990000.00, 40000.00, 100000.00, 7930000.00, 7930000, 'processing', 'VNPAY', 'paid', 4, '2026-06-24', '2026-06-28 18:00:00'),
(4, 'usr_cust_4', 34990000.00, 50000.00, 0.00, 35040000.00, 35040000, 'cancelled', 'VNPAY', 'refunded', 5, '2026-06-20', '2026-06-24 18:00:00');

-- 13. Order Items
INSERT INTO Order_items (id, OrderId, ShopId, ProductId, VariantId, ProductName, ProductImage, VariantName, VariantValue, Price, Quantity) VALUES
(1, 1, 1, 1, 3, 'iPhone 15 Pro Max', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 'Color / Storage', 'Titanium Natural / 256GB', 31990000.00, 1),
(2, 2, 2, 4, 11, 'Coolmate Active T-Shirt', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 'Color / Size', 'Black / L', 149000.00, 3),
(3, 2, 2, 5, 15, 'Coolmate Running Shorts', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', 'Color / Size', 'Black / M', 189000.00, 2),
(4, 3, 3, 7, 18, 'Sony WH-1000XM5', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Color', 'Black', 7990000.00, 1),
(5, 4, 1, 10, 25, 'Samsung Galaxy S24 Ultra', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 'Color / Storage', 'Titanium Gray / 512GB', 34990000.00, 1);

-- 14. Payment Transactions
INSERT INTO PaymentTransactions (Id, OrderId, Method, Status, TransactionCode, PaidAt) VALUES
(1, 1, 'COD', 'COMPLETED', 'TXN-COD-11002233', '2026-06-13 14:32:00'),
(2, 3, 'VNPAY', 'COMPLETED', 'TXN-VNPAY-22334455', '2026-06-24 10:15:30'),
(3, 4, 'VNPAY', 'REFUNDED', 'TXN-VNPAY-99887766', '2026-06-20 16:45:00');

-- 15. Vouchers
INSERT INTO Vouchers (Id, Code, DiscountType, Value, MaxDiscount, MinOrderValue, ExpiredAt, IsActive) VALUES
(1, 'VELORA50', 'percentage', 10, 50000, 200000, '2026-12-31 23:59:59', 1),
(2, 'SUPER100', 'fixed', 100000, 100000, 1000000, '2026-12-31 23:59:59', 1),
(3, 'FREETRIAL', 'percentage', 100, 50000, 0, '2026-07-31 23:59:59', 1),
(4, 'EXPIRED20', 'percentage', 20, 100000, 500000, '2026-05-01 00:00:00', 0);

-- 16. Order Vouchers
INSERT INTO Order_Vouchers (Id, OrderId, VoucherId) VALUES
(1, 1, 1),
(2, 3, 2);

-- 17. Order Tracking
INSERT INTO Order_Tracking (OrderTrackingId, OrderId, Status, Location, Description, UpdatedBy, CreatedAt) VALUES
(1, 1, 'pending', 'VeloraMall System', 'Order placed successfully.', 'system', '2026-06-10 10:00:00'),
(2, 1, 'confirmed', 'Shop Apple Premium Store', 'Shop confirmed the order.', 'shop', '2026-06-10 11:30:00'),
(3, 1, 'preparing', 'Shop Apple Premium Store', 'Goods are being packed.', 'shop', '2026-06-10 14:00:00'),
(4, 1, 'shipped', 'Ho Chi Minh City Sorting Hub', 'Order handed over to carrier.', 'carrier', '2026-06-11 08:30:00'),
(5, 1, 'in_transit', 'District 1 Distribution Center', 'In transit to local hub.', 'carrier', '2026-06-12 09:15:00'),
(6, 1, 'out_for_delivery', 'District 1 local carrier', 'Shipper Nguyen Van B (0902888999) is delivering the order.', 'carrier', '2026-06-13 09:00:00'),
(7, 1, 'delivered', 'Customer house', 'Package delivered successfully. Signee: Nguyen Van A.', 'carrier', '2026-06-13 14:30:00'),
(8, 2, 'pending', 'VeloraMall System', 'Order placed successfully, awaiting shop confirmation.', 'system', '2026-06-25 15:45:00'),
(9, 3, 'pending', 'VeloraMall System', 'Order placed and paid successfully.', 'system', '2026-06-24 10:15:00'),
(10, 3, 'confirmed', 'Sony Center Authorized', 'Shop confirmed the order.', 'shop', '2026-06-24 11:00:00'),
(11, 3, 'preparing', 'Sony Center Authorized', 'Shop is preparing items.', 'shop', '2026-06-25 09:00:00'),
(12, 4, 'pending', 'VeloraMall System', 'Order placed and paid successfully.', 'system', '2026-06-20 16:30:00'),
(13, 4, 'cancelled', 'Customer request', 'Order cancelled by customer. Reason: Changed mind.', 'system', '2026-06-20 16:45:00');

-- 18. Shipping Details
INSERT INTO Shipping_Details (Id, OrderId, Carrier, TrackingCode, CurrentLocation, Status, ShipperId, EstimatedDeliveryDate, UpdatedAt) VALUES
(1, 1, 'GHN', 'GHN-VN-9908871', 'Delivered', 'delivered', 'shipper_99', '2026-06-14 18:00:00', '2026-06-13 14:30:00'),
(2, 2, 'GHTK', 'GHTK-VN-110022', 'Shop warehouse', 'pending', NULL, '2026-06-29 18:00:00', '2026-06-25 15:45:00'),
(3, 3, 'J&T', 'JT-VN-8877665', 'Shop warehouse', 'preparing', NULL, '2026-06-28 18:00:00', '2026-06-25 09:00:00');

-- 19. Attributes
INSERT INTO Attributes (AttributeId, Name) VALUES
(1, 'Color'),
(2, 'Storage'),
(3, 'RAM'),
(4, 'Size');

-- 20. Attribute Values
INSERT INTO Attribute_values (ValueId, AttributeId, Value) VALUES
(1, 1, 'Black'),
(2, 1, 'Natural'),
(3, 1, 'Blue'),
(4, 1, 'Silver'),
(5, 1, 'White'),
(6, 1, 'Titanium Gray'),
(7, 2, '64GB'),
(8, 2, '256GB'),
(9, 2, '512GB'),
(10, 3, '8GB'),
(11, 3, '16GB'),
(12, 4, 'S'),
(13, 4, 'M'),
(14, 4, 'L'),
(15, 4, 'XL'),
(16, 4, '40'),
(17, 4, '41'),
(18, 4, '42');

-- 21. Product Attributes
INSERT INTO Product_attributes (ProductId, ValueId) VALUES
(1, 1), (1, 2), (1, 8), (1, 9),
(2, 1), (2, 10), (2, 11), (2, 9),
(3, 3), (3, 7), (3, 8),
(4, 1), (4, 3), (4, 12), (4, 13), (4, 14),
(5, 1), (5, 12), (5, 13), (5, 14),
(7, 1), (7, 4),
(8, 1), (8, 4),
(10, 6), (10, 8), (10, 9),
(11, 16), (11, 17), (11, 18),
(12, 17), (12, 18),
(13, 1), (13, 5);

-- 22. Variant Attributes
INSERT INTO Variant_attributes (VariantId, ValueId) VALUES
(1, 1), (1, 8),
(2, 1), (2, 9),
(3, 2), (3, 8),
(4, 2), (4, 9),
(5, 1), (5, 10), (5, 9),
(6, 1), (6, 11), (6, 9),
(7, 3), (7, 7),
(8, 3), (8, 8),
(9, 1), (9, 12),
(10, 1), (10, 13),
(11, 1), (11, 14),
(12, 3), (12, 12),
(13, 3), (13, 13),
(14, 1), (14, 12),
(15, 1), (15, 13),
(16, 1), (16, 14),
(18, 1),
(19, 4),
(20, 1),
(21, 4),
(24, 6), (24, 8),
(25, 6), (25, 9),
(26, 16),
(27, 17),
(28, 18),
(29, 17),
(30, 18),
(31, 1),
(32, 5);

-- 23. Inventories
INSERT INTO Inventories (ProductVariantId, AvailableStock, ReservedStock, SoldStock) VALUES
(1, 48, 2, 10),
(2, 30, 0, 5),
(3, 39, 1, 12),
(4, 30, 0, 4),
(5, 23, 2, 8),
(6, 25, 0, 6),
(7, 45, 0, 15),
(8, 35, 0, 10),
(9, 95, 5, 25),
(10, 147, 3, 40),
(11, 145, 5, 30),
(12, 50, 0, 12),
(13, 48, 2, 8),
(14, 100, 0, 20),
(15, 98, 2, 15),
(16, 100, 0, 18),
(17, 1000, 0, 250),
(18, 59, 1, 35),
(19, 40, 0, 12),
(20, 70, 0, 28),
(21, 50, 0, 14),
(22, 10, 0, 2),
(23, 5, 0, 1),
(24, 50, 0, 15),
(25, 40, 0, 8),
(26, 20, 0, 5),
(27, 20, 0, 8),
(28, 20, 0, 10),
(29, 40, 0, 12),
(30, 40, 0, 15),
(31, 60, 0, 22),
(32, 50, 0, 18);

-- 24. Accounts
INSERT INTO Accounts (UserId, Username, Email, PasswordHash, Role, IsVerified, IsActive) VALUES
('usr_admin', 'admin', 'admin@veloramall.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'ADMIN', 1, 1),
('usr_seller_1', 'apple_store', 'apple_store@veloramall.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'SELLER', 1, 1),
('usr_seller_2', 'coolmate_vietnam', 'coolmate@veloramall.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'SELLER', 1, 1),
('usr_seller_3', 'sony_vietnam', 'sony_center@veloramall.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'SELLER', 1, 1),
('usr_cust_1', 'nguyenvana', 'nguyen.van.a@gmail.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'CUSTOMER', 1, 1),
('usr_cust_2', 'tranthib', 'tran.thi.b@gmail.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'CUSTOMER', 1, 1),
('usr_cust_3', 'levanc', 'le.van.c@gmail.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'CUSTOMER', 1, 1),
('usr_cust_4', 'phamthid', 'pham.thi.d@gmail.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'CUSTOMER', 0, 1),
('usr_cust_5', 'hoangvane', 'hoang.van.e@gmail.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'CUSTOMER', 1, 1),
('usr_cust_6', 'buithif', 'bui.thi.f@gmail.com', '$2a$11$JAvuAp12LrDzREffqucEnuDAwnWbhH/G1dleDd5Dx2s8UF3WV9blK', 'CUSTOMER', 1, 0);

-- 25. Reviews
INSERT INTO Reviews (ReviewId, ProductId, UserId, OrderItemId, Rating, Content, IsHidden, CreatedAt) VALUES
(1, 1, 'usr_cust_1', 1, 5, 'Sản phẩm tuyệt vời! Camera chụp ảnh siêu đẹp, pin dùng cả ngày không hết.', 0, '2026-06-15 08:30:00'),
(2, 4, 'usr_cust_2', 2, 4, 'Áo mặc mát, co giãn tốt, phù hợp chạy bộ. Tuy nhiên màu đen hơi nhanh bạc.', 0, '2026-06-27 10:15:00'),
(3, 7, 'usr_cust_3', 4, 5, 'Chống ồn đỉnh cao, đeo cả ngày không bị đau tai. Rất đáng đồng tiền bát gạo!', 0, '2026-06-29 19:45:00'),
(4, 10, 'usr_cust_4', 5, 3, 'Màn hình đẹp nhưng máy hơi nặng và to, cầm lâu mỏi tay.', 0, '2026-06-25 14:00:00');

-- 26. Review Images
INSERT INTO Review_Images (ReviewImageId, ReviewId, ImageUrl, SortOrder) VALUES
(1, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 0),
(2, 2, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 0);

-- 27. Review Replies
INSERT INTO Review_Replies (ReplyId, ReviewId, ShopId, Content, CreatedAt) VALUES
(1, 1, 1, 'Cảm ơn quý khách đã tin tưởng ủng hộ Apple Premium Store! Rất hân hạnh được phục vụ quý khách lần sau.', '2026-06-15 10:00:00'),
(2, 2, 2, 'Dạ Coolmate xin ghi nhận phản hồi của mình về chất liệu màu sắc để tiếp tục tối ưu sản phẩm tốt hơn ạ.', '2026-06-27 11:30:00');

SET FOREIGN_KEY_CHECKS = 1;

