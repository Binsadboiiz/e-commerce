SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM Inventories;
DELETE FROM Variant_attributes;
DELETE FROM Product_images;
DELETE FROM Product_attributes;
DELETE FROM Product_variants;
DELETE FROM Products;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- PRODUCTS
-- =========================================================
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

-- 1
(1, 1, 'u1',
'MacBook Air M3',
'Apple lightweight premium laptop for productivity',
1499, 1399,
1, 1,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n',
4.7, 210,
'active',
'macbook-air-m3',
NOW(), NOW()),

-- 2
(2, 1, 'u1',
'Sony WH-1000XM5',
'Noise cancelling headphones',
399, 349,
1, 5,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux',
4.9, 980,
'active',
'sony-wh-1000xm5',
NOW(), NOW()),

-- 3
(3, 2, 'u2',
'iPhone 15 Pro Max',
'Apple flagship smartphone',
1299, 1199,
1, 1,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n',
4.9, 320,
'active',
'iphone-15-pro-max',
NOW(), NOW()),

-- 4
(4, 2, 'u2',
'Samsung Galaxy S24 Ultra',
'Premium Android phone',
1199, 1099,
1, 2,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b',
4.8, 280,
'active',
'samsung-galaxy-s24-ultra',
NOW(), NOW()),

-- 5
(5, 3, 'u3',
'Nike Air Force 1 White',
'Classic street sneakers',
120, 99,
3, 3,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck',
4.8, 1500,
'active',
'nike-air-force-1-white',
NOW(), NOW()),

-- 6
(6, 3, 'u3',
'Adidas Hoodie Black',
'Streetwear hoodie premium',
85, 70,
2, 4,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sokv1ydau59mv4xxha3l',
4.4, 310,
'active',
'adidas-hoodie-black',
NOW(), NOW()),

-- 7
(7, 4, 'u4',
'Nike Air Max 270',
'Comfort running shoes',
150, 120,
3, 3,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mnkl1z9o7wxztxinexpq',
4.5, 500,
'active',
'nike-air-max-270',
NOW(), NOW()),

-- 8
(8, 4, 'u4',
'Adidas Ultraboost 23',
'High performance running shoes',
190, 160,
3, 4,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/n5rr6po3epyoza9qbcy7',
4.7, 980,
'active',
'adidas-ultraboost-23',
NOW(), NOW()),

-- 9
(9, 5, 'u5',
'Apple Watch Series 9',
'Smart health tracking watch',
399, 349,
1, 1,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/tslxaa8n9suwzl1pmhhv',
4.8, 520,
'active',
'apple-watch-series-9',
NOW(), NOW()),

-- 10
(10, 5, 'u5',
'Logitech MX Master 3S',
'Wireless productivity mouse',
99, 89,
4, 7,
'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/eszg0kh343l1rx9oyrvl',
4.8, 1200,
'active',
'logitech-mx-master-3s',
NOW(), NOW());

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================
INSERT INTO Product_images (
    ProductId,
    ImageUrl,
    IsPrimary,
    SortOrder
)
VALUES

(1, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/cl3ih9extg2iylcc2h7n', 1, 0),
(2, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/ymgyiarww7ocyuwfduux', 1, 0),
(3, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/erni4vvbvtvykn0xyz8n', 1, 0),
(4, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/kgjgj5xzjty0i5bwn82b', 1, 0),
(5, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sfcorksochwnrn4xsvck', 1, 0),
(6, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/sokv1ydau59mv4xxha3l', 1, 0),
(7, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/mnkl1z9o7wxztxinexpq', 1, 0),
(8, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/n5rr6po3epyoza9qbcy7', 1, 0),
(9, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/tslxaa8n9suwzl1pmhhv', 1, 0),
(10, 'https://res.cloudinary.com/dof7bsp6z/image/upload/veloramall/products/eszg0kh343l1rx9oyrvl', 1, 0);

-- =========================================================
-- PRODUCT VARIANTS
-- =========================================================
INSERT INTO Product_variants (
    VariantId,
    ProductId,
    SKU,
    Price
)
VALUES

-- MacBook
(1, 1, 'MBA-M3-256', 1399),
(2, 1, 'MBA-M3-512', 1599),

-- Sony Headphone
(3, 2, 'SONY-BLK', 349),
(4, 2, 'SONY-SLV', 349),

-- iPhone
(5, 3, 'IP15PM-BLK', 1199),
(6, 3, 'IP15PM-NAT', 1199),

-- Samsung
(7, 4, 'S24-BLK', 1099),
(8, 4, 'S24-GRY', 1099),

-- AF1
(9, 5, 'AF1-40', 99),
(10, 5, 'AF1-41', 99),
(11, 5, 'AF1-42', 99),

-- Hoodie
(12, 6, 'HOODIE-M', 70),
(13, 6, 'HOODIE-L', 70);

-- =========================================================
-- VARIANT ATTRIBUTES
-- =========================================================
INSERT INTO Variant_attributes (
    VariantId,
    ValueId
)
VALUES

-- MacBook
(1, 8),
(2, 9),

-- Sony
(3, 1),
(4, 2),

-- iPhone
(5, 1),
(6, 2),

-- Samsung
(7, 1),
(8, 2),

-- AF1
(9, 3),
(10, 4),
(11, 5),

-- Hoodie
(12, 6),
(13, 7);

-- =========================================================
-- INVENTORIES
-- =========================================================
INSERT INTO Inventories (
    ProductVariantId,
    AvailableStock,
    ReservedStock,
    SoldStock
)
VALUES

-- MacBook
(1, 5, 0, 2),
(2, 5, 1, 1),

-- Sony
(3, 15, 0, 10),
(4, 10, 0, 4),

-- iPhone
(5, 8, 0, 12),
(6, 7, 0, 8),

-- Samsung
(7, 10, 0, 15),
(8, 10, 1, 10),

-- AF1
(9, 20, 2, 20),
(10, 20, 1, 15),
(11, 20, 0, 10),

-- Hoodie
(12, 15, 0, 5),
(13, 15, 0, 3);