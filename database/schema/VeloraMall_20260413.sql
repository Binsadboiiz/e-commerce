-- VeloraMall Database Schema v2
-- Updated: 2026-04-13
-- Changes: Added Product_variants table, updated Cart_Items with VariantId

CREATE DATABASE IF NOT EXISTS VeloraMall;
USE VeloraMall;

SET FOREIGN_KEY_CHECKS = 0;

-- ========================
-- USERS
-- ========================
CREATE TABLE Users (
    UserId VARCHAR(50) PRIMARY KEY,
    Email VARCHAR(255) UNIQUE,
    Fullname VARCHAR(255),
    Password VARCHAR(255),
    Phone VARCHAR(50) UNIQUE,
    Role VARCHAR(50),
    Avatar LONGTEXT,
    IsActive TINYINT DEFAULT 1
);

-- ========================
-- ADDRESSES
-- ========================
CREATE TABLE Addresses (
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

-- ========================
-- SHOPS
-- ========================
CREATE TABLE Shops (
    ShopId BIGINT AUTO_INCREMENT PRIMARY KEY,
    OwnerId VARCHAR(50),
    Name VARCHAR(255),
    Description VARCHAR(500),
    Status ENUM('active','inactive','banned'),
    Logo LONGTEXT,
    IsActive TINYINT DEFAULT 1,
    Create_At DATE,
    Update_At DATE,
    FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
);

-- ========================
-- BRANDS
-- ========================
CREATE TABLE Brands (
    BrandId BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255)
);

-- ========================
-- CATEGORIES
-- ========================
CREATE TABLE Categories (
    CategoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255)
);

-- ========================
-- PRODUCTS
-- ========================
CREATE TABLE Products (
    ProductId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ShopId BIGINT,
    RetailerId VARCHAR(50),
    Name VARCHAR(255),
    Description VARCHAR(500),
    Price DOUBLE,
    DiscountPrice DOUBLE,
    Stock INT,
    CategoryId BIGINT,
    BrandId BIGINT,
    Image LONGTEXT,       -- URL to product image
    RatingAvg FLOAT DEFAULT 0,
    RatingCount BIGINT DEFAULT 0,
    Status ENUM('active','inactive'),
    
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId),
    FOREIGN KEY (RetailerId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
    FOREIGN KEY (BrandId) REFERENCES Brands(BrandId)
);

-- ========================
-- PRODUCT VARIANTS (NEW)
-- ========================
CREATE TABLE Product_variants (
    VariantId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductId BIGINT NOT NULL,
    VariantName VARCHAR(100) NOT NULL,     -- e.g. 'Size', 'Color'
    VariantValue VARCHAR(100) NOT NULL,    -- e.g. 'L', 'Black'
    PriceAdjustment DOUBLE DEFAULT 0,     -- extra cost for this variant
    Stock INT DEFAULT 0,

    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE
);

-- ========================
-- CARTS
-- ========================
CREATE TABLE Carts (
    CartId BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50) UNIQUE,            -- one cart per user
    Create_At DATE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- ========================
-- CART ITEMS (UPDATED)
-- ========================
CREATE TABLE Cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    CartId BIGINT,
    Product_id BIGINT,
    VariantId BIGINT NULL,
    Quantity INT DEFAULT 1,

    FOREIGN KEY (CartId) REFERENCES Carts(CartId) ON DELETE CASCADE,
    FOREIGN KEY (Product_id) REFERENCES Products(ProductId),
    FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId) ON DELETE SET NULL
);

-- ========================
-- ORDERS
-- ========================
CREATE TABLE Orders (
    OrderId BIGINT AUTO_INCREMENT PRIMARY KEY,
    CustomerId VARCHAR(50),
    TotalAmount BIGINT,
    Status ENUM('pending','processing','completed','cancelled'),
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(50),
    AddressId BIGINT,
    Create_At DATE,

    FOREIGN KEY (CustomerId) REFERENCES Users(UserId),
    FOREIGN KEY (AddressId) REFERENCES Addresses(Id)
);

-- ========================
-- ORDER ITEMS
-- ========================
CREATE TABLE Order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId BIGINT,
    ShopId BIGINT,
    ProductId BIGINT,
    ProductName VARCHAR(255),
    Price DOUBLE,
    Quantity INT,

    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

-- ========================
-- INDEXES
-- ========================
CREATE INDEX idx_user_email ON Users(Email);
CREATE INDEX idx_product_shop ON Products(ShopId);
CREATE INDEX idx_product_category ON Products(CategoryId);
CREATE INDEX idx_cart_user ON Carts(UserId);
CREATE INDEX idx_order_customer ON Orders(CustomerId);
CREATE INDEX idx_variant_product ON Product_variants(ProductId);

SET FOREIGN_KEY_CHECKS = 1;
