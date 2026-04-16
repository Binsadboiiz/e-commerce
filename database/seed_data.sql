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