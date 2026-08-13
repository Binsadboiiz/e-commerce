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
    Image LONGTEXT,
    RatingAvg FLOAT DEFAULT 0,
    RatingCount BIGINT DEFAULT 0,
    Status ENUM('active','inactive'),
    
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId),
    FOREIGN KEY (RetailerId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
    FOREIGN KEY (BrandId) REFERENCES Brands(BrandId)
);

-- ========================
-- CARTS
-- ========================
CREATE TABLE Carts (
    CartId BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50),
    Create_At DATE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- ========================
-- CART ITEMS
-- ========================
CREATE TABLE Cart_Items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    CartId BIGINT,
    Product_id BIGINT,
    Quantity BIGINT,

    FOREIGN KEY (CartId) REFERENCES Carts(CartId) ON DELETE CASCADE,
    FOREIGN KEY (Product_id) REFERENCES Products(ProductId)
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
CREATE TABLE Order_Items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ShopId BIGINT,
    ProductId BIGINT,
    ProductName VARCHAR(255),
    Price DOUBLE,
    Quantity INT,

    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

CREATE INDEX idx_user_email ON Users(Email);
CREATE INDEX idx_product_shop ON Products(ShopId);
CREATE INDEX idx_product_category ON Products(CategoryId);
CREATE INDEX idx_cart_user ON Carts(UserId);
CREATE INDEX idx_order_customer ON Orders(CustomerId);