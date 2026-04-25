INSERT INTO Users (UserId, Email, Fullname, Password, Phone, Role)
VALUES
('u1', 'john.miller@gmail.com', 'John Miller', '123456', '9011111111', 'seller'),
('u2', 'emma.watson@gmail.com', 'Emma Watson', '123456', '9022222222', 'seller'),
('u3', 'liam.smith@gmail.com', 'Liam Smith', '123456', '9033333333', 'seller'),
('u4', 'sophia.brown@gmail.com', 'Sophia Brown', '123456', '9044444444', 'seller'),
('u5', 'noah.johnson@gmail.com', 'Noah Johnson', '123456', '9055555555', 'seller');


INSERT INTO Shops (OwnerId, Name, Description, Status, Create_At)
VALUES
('u1', 'Global Tech Store', 'Premium electronics seller', 'active', CURDATE()),
('u2', 'Velora Official Store', 'Main flagship store', 'active', CURDATE()),
('u3', 'Urban Fashion Hub', 'Modern streetwear fashion store', 'active', CURDATE()),
('u4', 'Sneaker World', 'Exclusive sneaker collection', 'active', CURDATE()),
('u5', 'Home & Lifestyle Store', 'Daily essentials and accessories', 'active', CURDATE());

INSERT INTO Brands (BrandId, Name)
VALUES
(1, 'Apple'),
(2, 'Samsung'),
(3, 'Nike'),
(4, 'Adidas'),
(5, 'Sony'),
(6, 'Dell'),
(7, 'Logitech'),
(8, 'Canon');

INSERT INTO Categories (CategoryId, type)
VALUES
(1, 'Electronics'),
(2, 'Fashion'),
(3, 'Shoes'),
(4, 'Accessories');


INSERT INTO Products (
    ShopId,
    RetailerId,
    Name,
    Description,
    Price,
    DiscountPrice,
    Stock,
    CategoryId,
    BrandId,
    Image,
    RatingAvg,
    RatingCount,
    Status
)
VALUES

-- u1 (Tech)
(1, 'u1', 'MacBook Air M3', 'Apple lightweight premium laptop for productivity', 1499, 1399, 12, 1, 1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n', 4.7, 210, 'active'),
(1, 'u1', 'Sony WH-1000XM5', 'Noise cancelling headphones', 399, 349, 25, 1, 5, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux', 4.9, 980, 'active'),

-- u2 (main)
(2, 'u2', 'iPhone 15 Pro Max', 'Apple flagship smartphone', 1299, 1199, 15, 1, 1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n', 4.9, 320, 'active'),
(2, 'u2', 'Samsung Galaxy S24 Ultra', 'Premium Android phone', 1199, 1099, 20, 1, 2, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b', 4.8, 280, 'active'),

-- u3 (fashion)
(3, 'u3', 'Nike Air Force 1 White', 'Classic street sneakers', 120, 99, 60, 3, 3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck', 4.8, 1500, 'active'),
(3, 'u3', 'Adidas Hoodie Black', 'Streetwear hoodie premium', 85, 70, 40, 2, 4, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sokv1ydau59mv4xxha3l', 4.4, 310, 'active'),

-- u4 (sneakers)
(4, 'u4', 'Nike Air Max 270', 'Comfort running shoes', 150, 120, 35, 3, 3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mnkl1z9o7wxztxinexpq', 4.5, 500, 'active'),
(4, 'u4', 'Adidas Ultraboost 23', 'High performance running shoes', 190, 160, 25, 3, 4, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/n5rr6po3epyoza9qbcy7', 4.7, 980, 'active'),

-- u5 (lifestyle)
(5, 'u5', 'Apple Watch Series 9', 'Smart health tracking watch', 399, 349, 18, 1, 1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/tslxaa8n9suwzl1pmhhv', 4.8, 520, 'active'),
(5, 'u5', 'Logitech MX Master 3S', 'Wireless productivity mouse', 99, 89, 70, 4, 7, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/eszg0kh343l1rx9oyrvl', 4.8, 1200, 'active'),

-- extra mix
(1, 'u1', 'Canon EOS R10 Camera', 'Mirrorless professional camera', 999, 949, 10, 1, 8, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mbttw4lpkmbv09aauzle', 4.7, 260, 'active'),
(2, 'u2', 'iPad Pro M2', 'Professional tablet', 999, 899, 12, 1, 1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/pcrrtboejjfe5xygbcpi', 4.9, 600, 'active'),
(3, 'u3', 'Nike Backpack Elite', 'Urban travel backpack', 75, 65, 55, 4, 3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/g7tbpftadfaypvpty0vc', 4.4, 210, 'active'),
(4, 'u4', 'Samsung Galaxy Buds 3', 'Wireless earbuds', 199, 159, 40, 1, 2, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/loyqprophd8lme2e4kwm', 4.5, 210, 'active'),
(5, 'u5', 'Sony Alpha A7 III', 'Full frame camera', 1999, 1899, 8, 1, 5, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kkhb5d6czjvqpl8gtaji', 4.9, 340, 'active');

INSERT INTO Attributes (AttributeId, Name)
VALUES
(1, 'Color'),
(2, 'Size'),
(3, 'Material');

INSERT INTO Attribute_values (ValueId, AttributeId, Value)
VALUES
-- Color
(1, 1, 'Black'),
(2, 1, 'White'),
(3, 1, 'Red'),

-- Size
(4, 2, 'S'),
(5, 2, 'M'),
(6, 2, 'L'),

-- Material
(7, 3, 'Cotton'),
(8, 3, 'Leather');

INSERT INTO Product_attributes (ProductId, ValueId)
VALUES

-- MacBook (Black)
(1, 1),

-- Sony Headphone (Black)
(2, 1),

-- iPhone (Black)
(3, 1),

-- Samsung (Black)
(4, 1),

-- Nike AF1 (White)
(5, 2),

-- Adidas Hoodie (Black, Size L, Cotton)
(6, 1),
(6, 6),
(6, 7),

-- Nike Air Max (Red)
(7, 3),

-- Ultraboost (Black)
(8, 1),

-- Apple Watch (Black)
(9, 1),

-- Logitech Mouse (Black)
(10, 1),

-- Canon Camera (Black)
(11, 1),

-- iPad (Black)
(12, 1),

-- Backpack (Black)
(13, 1),

-- Galaxy Buds (Black)
(14, 1),

-- Sony Camera (Black)
(15, 1);


INSERT INTO Product_images (ProductId, ImageUrl, IsPrimary, SortOrder)
VALUES

-- MacBook Air M3 (1)
(1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n', 1, 0),
(1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/macbook_air_1', 0, 1),
(1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/macbook_air_2', 0, 2),

-- Sony Headphones (2)
(2, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux', 1, 0),
(2, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sony_headphone_1', 0, 1),

-- iPhone 15 (3)
(3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n', 1, 0),
(3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/iphone_1', 0, 1),
(3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/iphone_2', 0, 2),

-- Samsung S24 (4)
(4, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b', 1, 0),
(4, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/samsung_1', 0, 1),

-- Nike AF1 (5)
(5, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck', 1, 0),
(5, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/nike_af1_1', 0, 1),

-- Adidas Hoodie (6)
(6, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sokv1ydau59mv4xxha3l', 1, 0),
(6, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/adidas_hoodie_1', 0, 1),

-- Nike Air Max (7)
(7, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mnkl1z9o7wxztxinexpq', 1, 0),

-- Ultraboost (8)
(8, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/n5rr6po3epyoza9qbcy7', 1, 0),

-- Apple Watch (9)
(9, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/tslxaa8n9suwzl1pmhhv', 1, 0),

-- Logitech Mouse (10)
(10, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/eszg0kh343l1rx9oyrvl', 1, 0),

-- Canon Camera (11)
(11, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mbttw4lpkmbv09aauzle', 1, 0),

-- iPad Pro (12)
(12, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/pcrrtboejjfe5xygbcpi', 1, 0),

-- Backpack (13)
(13, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/g7tbpftadfaypvpty0vc', 1, 0),

-- Galaxy Buds (14)
(14, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/loyqprophd8lme2e4kwm', 1, 0),

-- Sony A7 III (15)
(15, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kkhb5d6czjvqpl8gtaji', 1, 0);


INSERT INTO product_variants (ProductId, VariantName, VariantValue, PriceAdjustment, Stock)
VALUES

-- MacBook Air M3 (1)
(1, 'Storage', '256GB', 0, 5),
(1, 'Storage', '512GB', 200, 5),

-- Sony WH-1000XM5 (2)
(2, 'Color', 'Black', 0, 15),
(2, 'Color', 'Silver', 0, 10),

-- iPhone 15 Pro Max (3)
(3, 'Color', 'Black Titanium', 0, 8),
(3, 'Color', 'Natural Titanium', 0, 7),

-- Samsung S24 Ultra (4)
(4, 'Color', 'Black', 0, 10),
(4, 'Color', 'Gray', 0, 10),

-- Nike Air Force 1 (5)
(5, 'Size', '40', 0, 20),
(5, 'Size', '41', 0, 20),
(5, 'Size', '42', 0, 20),

-- Adidas Hoodie (6)
(6, 'Size', 'M', 0, 15),
(6, 'Size', 'L', 0, 15),

-- Nike Air Max 270 (7)
(7, 'Size', '40', 0, 10),
(7, 'Size', '41', 0, 10),

-- Ultraboost 23 (8)
(8, 'Size', '40', 0, 10),
(8, 'Size', '42', 0, 15),

-- Apple Watch Series 9 (9)
(9, 'Size', '41mm', 0, 10),
(9, 'Size', '45mm', 50, 8),

-- Logitech MX Master 3S (10)
(10, 'Color', 'Black', 0, 30),

-- Canon EOS R10 (11)
(11, 'Bundle', 'Body Only', 0, 5),
(11, 'Bundle', 'With Lens', 200, 5),

-- iPad Pro M2 (12)
(12, 'Storage', '128GB', 0, 6),
(12, 'Storage', '256GB', 150, 6),

-- Nike Backpack Elite (13)
(13, 'Color', 'Black', 0, 25),

-- Samsung Galaxy Buds 3 (14)
(14, 'Color', 'White', 0, 20),

-- Sony Alpha A7 III (15)
(15, 'Bundle', 'Body Only', 0, 4),
(15, 'Bundle', 'With Lens Kit', 300, 4);

UPDATE Products SET Slug = 'macbook-air-m3' WHERE ProductId = 1;
UPDATE Products SET Slug = 'sony-wh-1000xm5' WHERE ProductId = 2;
UPDATE Products SET Slug = 'iphone-15-pro-max' WHERE ProductId = 3;
UPDATE Products SET Slug = 'samsung-galaxy-s24-ultra' WHERE ProductId = 4;
UPDATE Products SET Slug = 'nike-air-force-1-white' WHERE ProductId = 5;
UPDATE Products SET Slug = 'adidas-hoodie-black' WHERE ProductId = 6;
UPDATE Products SET Slug = 'nike-air-max-270' WHERE ProductId = 7;
UPDATE Products SET Slug = 'adidas-ultraboost-23' WHERE ProductId = 8;
UPDATE Products SET Slug = 'apple-watch-series-9' WHERE ProductId = 9;
UPDATE Products SET Slug = 'logitech-mx-master-3s' WHERE ProductId = 10;
UPDATE Products SET Slug = 'canon-eos-r10-camera' WHERE ProductId = 11;
UPDATE Products SET Slug = 'ipad-pro-m2' WHERE ProductId = 12;
UPDATE Products SET Slug = 'nike-backpack-elite' WHERE ProductId = 13;
UPDATE Products SET Slug = 'samsung-galaxy-buds-3' WHERE ProductId = 14;
UPDATE Products SET Slug = 'sony-alpha-a7-iii' WHERE ProductId = 15;
