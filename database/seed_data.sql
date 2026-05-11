SET FOREIGN_KEY_CHECKS = 0;

-- =========================================
-- CLEAR OLD DATA
-- =========================================
TRUNCATE TABLE Order_items;
TRUNCATE TABLE Orders;

TRUNCATE TABLE Cart_items;
TRUNCATE TABLE Carts;

TRUNCATE TABLE Inventories;
TRUNCATE TABLE Variant_attributes;
TRUNCATE TABLE Product_attributes;

TRUNCATE TABLE Product_images;
TRUNCATE TABLE Product_variants;
TRUNCATE TABLE Products;

TRUNCATE TABLE Shop_addresses;
TRUNCATE TABLE Shops;

TRUNCATE TABLE Accounts;
TRUNCATE TABLE User_addresses;
TRUNCATE TABLE Users;

TRUNCATE TABLE Attribute_values;
TRUNCATE TABLE Attributes;

TRUNCATE TABLE Categories;
TRUNCATE TABLE Brands;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- USERS
-- =========================================
INSERT INTO Users (
    UserId,
    Email,
    Fullname,
    Phone,
    Avatar,
    IsActive
)
VALUES
('u1','john.miller@gmail.com','John Miller','9011111111',NULL,1),
('u2','emma.watson@gmail.com','Emma Watson','9022222222',NULL,1),
('u3','liam.smith@gmail.com','Liam Smith','9033333333',NULL,1),
('u4','sophia.brown@gmail.com','Sophia Brown','9044444444',NULL,1),
('u5','noah.johnson@gmail.com','Noah Johnson','9055555555',NULL,1),
('u6','olivia.davis@gmail.com','Olivia Davis','9066666666',NULL,1),
('u7','james.wilson@gmail.com','James Wilson','9077777777',NULL,1),
('u8','ava.moore@gmail.com','Ava Moore','9088888888',NULL,1);

-- =========================================
-- ACCOUNTS
-- =========================================
INSERT INTO Accounts (
    UserId,
    Username,
    Email,
    PasswordHash,
    Role,
    IsVerified,
    IsActive
)
VALUES
('u1','john','john.miller@gmail.com','123456','seller',1,1),
('u2','emma','emma.watson@gmail.com','123456','seller',1,1),
('u3','liam','liam.smith@gmail.com','123456','seller',1,1),
('u4','sophia','sophia.brown@gmail.com','123456','seller',1,1),
('u5','noah','noah.johnson@gmail.com','123456','seller',1,1),
('u6','olivia','olivia.davis@gmail.com','123456','seller',1,1),
('u7','james','james.wilson@gmail.com','123456','seller',1,1),
('u8','ava','ava.moore@gmail.com','123456','seller',1,1);

-- =========================================
-- SHOPS
-- =========================================
INSERT INTO Shops (
    ShopId,
    OwnerId,
    Name,
    Description,
    Status,
    Logo,
    IsActive,
    Create_At,
    Update_At
)
VALUES
(1,'u1','TechZone','Premium tech products','active',NULL,1,NOW(),NOW()),
(2,'u2','MobileHub','Smartphones and accessories','active',NULL,1,NOW(),NOW()),
(3,'u3','SneakerWorld','Sneakers and fashion','active',NULL,1,NOW(),NOW()),
(4,'u4','Sportify','Sportswear store','active',NULL,1,NOW(),NOW()),
(5,'u5','GearStore','Tech gear shop','active',NULL,1,NOW(),NOW()),
(6,'u6','LaptopCenter','Laptop specialist','active',NULL,1,NOW(),NOW()),
(7,'u7','GamingPro','Gaming products','active',NULL,1,NOW(),NOW()),
(8,'u8','CameraHouse','Camera equipment','active',NULL,1,NOW(),NOW());

-- =========================================
-- BRANDS
-- =========================================
INSERT INTO Brands (BrandId, Name)
VALUES
(1,'Apple'),
(2,'Samsung'),
(3,'Nike'),
(4,'Adidas'),
(5,'Sony'),
(6,'ASUS'),
(7,'Logitech'),
(8,'Dell'),
(9,'Canon');

-- =========================================
-- CATEGORIES
-- =========================================
INSERT INTO Categories (CategoryId, Type)
VALUES
(1,'Electronics'),
(2,'Fashion'),
(3,'Shoes'),
(4,'Accessories'),
(5,'Camera');

-- =========================================
-- ATTRIBUTES
-- =========================================
INSERT INTO Attributes (AttributeId, Name)
VALUES
(1,'Color'),
(2,'Size'),
(3,'Storage');

-- =========================================
-- ATTRIBUTE VALUES
-- =========================================
INSERT INTO Attribute_values (
    ValueId,
    AttributeId,
    Value
)
VALUES

-- COLORS
(1,1,'Black'),
(2,1,'White'),
(3,1,'Silver'),
(4,1,'Gray'),
(5,1,'Natural Titanium'),

-- SIZES
(6,2,'40'),
(7,2,'41'),
(8,2,'42'),
(9,2,'43'),
(10,2,'M'),
(11,2,'L'),

-- STORAGE
(12,3,'256GB'),
(13,3,'512GB'),
(14,3,'1TB');

-- =========================================
-- PRODUCTS
-- =========================================
INSERT INTO Products (
    ProductId,
    ShopId,
    RetailerId,
    Name,
    Description,
    Price,
    DiscountPrice,
    CategoryId,
    BrandId,
    Image,
    RatingAvg,
    RatingCount,
    Status,
    Slug,
    CreatedAt,
    UpdatedAt
)
VALUES

(1,1,'u1','MacBook Air M3','Apple lightweight premium laptop',1499,1399,1,1,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n',4.7,210,'active','macbook-air-m3',NOW(),NOW()),

(2,1,'u1','Sony WH-1000XM5','Noise cancelling headphones',399,349,1,5,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux',4.9,980,'active','sony-wh-1000xm5',NOW(),NOW()),

(3,2,'u2','iPhone 15 Pro Max','Apple flagship smartphone',1299,1199,1,1,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n',4.9,320,'active','iphone-15-pro-max',NOW(),NOW()),

(4,2,'u2','Samsung Galaxy S24 Ultra','Premium Android phone',1199,1099,1,2,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b',4.8,280,'active','s24-ultra',NOW(),NOW()),

(5,3,'u3','Nike Air Force 1','Classic sneakers',120,99,3,3,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck',4.8,1500,'active','af1',NOW(),NOW()),

(6,3,'u3','Adidas Hoodie','Streetwear hoodie',85,70,2,4,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sokv1ydau59mv4xxha3l',4.4,310,'active','hoodie',NOW(),NOW()),

(7,4,'u4','Nike Air Max 270','Comfort running shoes',150,120,3,3,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mnkl1z9o7wxztxinexpq',4.5,500,'active','air-max',NOW(),NOW()),

(8,4,'u4','Adidas Ultraboost 23','Performance running shoes',190,160,3,4,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/n5rr6po3epyoza9qbcy7',4.7,980,'active','ultraboost',NOW(),NOW()),

(9,5,'u5','Apple Watch Series 9','Smartwatch',399,349,1,1,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/tslxaa8n9suwzl1pmhhv',4.8,520,'active','watch9',NOW(),NOW()),

(10,5,'u5','Logitech MX Master 3S','Wireless productivity mouse',99,89,4,7,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/eszg0kh343l1rx9oyrvl',4.8,1200,'active','mx-master',NOW(),NOW()),

(11,6,'u6','Dell XPS 13','Ultrabook productivity laptop',1299,1199,1,8,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n',4.6,410,'active','xps13',NOW(),NOW()),

(12,6,'u6','AirPods Pro 2','Apple ANC earbuds',249,219,1,1,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux',4.9,1500,'active','airpods-pro',NOW(),NOW()),

(13,7,'u7','ASUS ROG Strix','Gaming laptop',1799,1599,1,6,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n',4.7,600,'active','rog',NOW(),NOW()),

(14,7,'u7','Samsung Galaxy Buds 2','Wireless earbuds',149,129,1,2,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b',4.5,720,'active','buds2',NOW(),NOW()),

(15,8,'u8','Canon EOS R50','Mirrorless camera',679,629,5,9,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck',4.8,300,'active','r50',NOW(),NOW());

-- =========================================
-- PRODUCT VARIANTS
-- =========================================
INSERT INTO Product_variants (
    VariantId,
    ProductId,
    SKU,
    Price
)
VALUES

-- MACBOOK
(1,1,'MBA-256-SLV',1399),
(2,1,'MBA-512-SLV',1599),

-- SONY
(3,2,'SONY-BLK',349),
(4,2,'SONY-WHT',349),

-- IPHONE
(5,3,'IP15-BLK-256',1199),
(6,3,'IP15-NAT-512',1399),

-- S24
(7,4,'S24-BLK',1099),
(8,4,'S24-GRY',1099),

-- AF1
(9,5,'AF1-40',99),
(10,5,'AF1-41',99),
(11,5,'AF1-42',99),

-- HOODIE
(12,6,'HOODIE-M',70),
(13,6,'HOODIE-L',70);

-- =========================================
-- VARIANT ATTRIBUTES
-- =========================================
INSERT INTO Variant_attributes (
    VariantId,
    ValueId
)
VALUES

-- MACBOOK
(1,3),
(1,12),

(2,3),
(2,13),

-- SONY
(3,1),
(4,2),

-- IPHONE
(5,1),
(5,12),

(6,5),
(6,13),

-- S24
(7,1),
(8,4),

-- AF1
(9,6),
(10,7),
(11,8),

-- HOODIE
(12,10),
(13,11);

-- =========================================
-- PRODUCT ATTRIBUTES
-- =========================================
INSERT INTO Product_attributes (
    ProductId,
    ValueId
)
VALUES

-- MACBOOK
(1,3),
(1,12),
(1,13),

-- SONY
(2,1),
(2,2),

-- IPHONE
(3,1),
(3,5),
(3,12),
(3,13),

-- AF1
(5,6),
(5,7),
(5,8),

-- HOODIE
(6,10),
(6,11);

-- =========================================
-- INVENTORIES
-- =========================================
INSERT INTO Inventories (
    ProductVariantId,
    AvailableStock,
    ReservedStock,
    SoldStock
)
VALUES

(1,5,0,2),
(2,4,1,1),

(3,15,0,10),
(4,10,0,4),

(5,8,0,12),
(6,7,0,8),

(7,10,0,15),
(8,10,1,10),

(9,20,2,20),
(10,18,1,15),
(11,16,0,10),

(12,15,0,5),
(13,15,0,3);

-- =========================================
-- PRODUCT IMAGES
-- =========================================
INSERT INTO Product_images (
    ProductId,
    VariantId,
    ImageUrl,
    IsPrimary,
    SortOrder
)
VALUES

-- PRODUCT THUMBNAILS
(1,NULL,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n',1,0),
(2,NULL,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux',1,0),
(3,NULL,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n',1,0),
(4,NULL,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b',1,0),
(5,NULL,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck',1,0),

-- VARIANT IMAGES
(1,1,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/macbook_air_1',0,1),
(1,2,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/macbook_air_2',0,2),

(3,5,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/iphone_black',0,1),
(3,6,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/iphone_natural',0,2),

(5,9,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/af1_40',0,1),
(5,10,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/af1_41',0,2),
(5,11,'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/af1_42',0,3);