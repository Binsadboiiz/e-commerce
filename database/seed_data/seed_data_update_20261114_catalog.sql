-- =========================================================================
-- EXTRA CATALOG SEED (2026-11-14)
-- Adds categories, brands and 61 products on top of seed_data.sql.
-- ID-independent and safe to re-run: categories/brands are matched by name,
-- products by unique Slug, shops are picked from whatever exists in Shops.
-- Does not truncate anything. Needs MySQL 8+ and Products.Status = 'ACTIVE'
-- (schema/db_20261007_product_status.sql). Images are picsum.photos placeholders.
-- =========================================================================

INSERT INTO Categories (Type)
SELECT x.t FROM (
  SELECT 'Phones' AS t
  UNION ALL
  SELECT 'Laptops' AS t
  UNION ALL
  SELECT 'Audio' AS t
  UNION ALL
  SELECT 'Home Appliances' AS t
  UNION ALL
  SELECT 'Beauty' AS t
  UNION ALL
  SELECT 'Books' AS t
  UNION ALL
  SELECT 'Sports' AS t
  UNION ALL
  SELECT 'Toys' AS t
  UNION ALL
  SELECT 'Kitchen' AS t
  UNION ALL
  SELECT 'Furniture' AS t
) x WHERE x.t NOT IN (SELECT Type FROM Categories WHERE Type IS NOT NULL);

INSERT INTO Brands (Name)
SELECT x.n FROM (
  SELECT 'Xiaomi' AS n
  UNION ALL
  SELECT 'HP' AS n
  UNION ALL
  SELECT 'Lenovo' AS n
  UNION ALL
  SELECT 'JBL' AS n
  UNION ALL
  SELECT 'Philips' AS n
  UNION ALL
  SELECT 'Panasonic' AS n
  UNION ALL
  SELECT 'LG' AS n
  UNION ALL
  SELECT 'Puma' AS n
  UNION ALL
  SELECT 'Uniqlo' AS n
  UNION ALL
  SELECT 'Lego' AS n
  UNION ALL
  SELECT 'L''Oreal' AS n
  UNION ALL
  SELECT 'Decathlon' AS n
  UNION ALL
  SELECT 'Nha Nam' AS n
  UNION ALL
  SELECT 'IKEA' AS n
  UNION ALL
  SELECT 'Sunhouse' AS n
) x WHERE x.n NOT IN (SELECT Name FROM Brands WHERE Name IS NOT NULL);

DROP TEMPORARY TABLE IF EXISTS tmp_seed;
CREATE TEMPORARY TABLE tmp_seed AS
SELECT 'Xiaomi 14T Pro' AS Name, 'xiaomi-14t-pro' AS Slug, 'Flagship phone with Leica camera' AS Description, 14990000 AS Price, 13191000 AS Disc, 'Phones' AS Cat, 'Xiaomi' AS Brand, 2 AS ShopIdx, 4.6 AS Rating, 420 AS RatingCount, 10 AS Stock, 0 AS Sold
UNION ALL
SELECT 'Xiaomi Redmi Note 13' AS Name, 'xiaomi-redmi-note-13' AS Slug, 'Great value 5G smartphone' AS Description, 5490000 AS Price, 4941000 AS Disc, 'Phones' AS Cat, 'Xiaomi' AS Brand, 2 AS ShopIdx, 4.5 AS Rating, 980 AS RatingCount, 17 AS Stock, 13 AS Sold
UNION ALL
SELECT 'Samsung Galaxy A55' AS Name, 'samsung-galaxy-a55' AS Slug, 'Mid-range phone with AMOLED display' AS Description, 9990000 AS Price, 9191000 AS Disc, 'Phones' AS Cat, 'Samsung' AS Brand, 2 AS ShopIdx, 4.5 AS Rating, 610 AS RatingCount, 24 AS Stock, 26 AS Sold
UNION ALL
SELECT 'iPhone 14' AS Name, 'iphone-14' AS Slug, 'Apple smartphone with dual camera' AS Description, 16990000 AS Price, 15291000 AS Disc, 'Phones' AS Cat, 'Apple' AS Brand, 2 AS ShopIdx, 4.8 AS Rating, 760 AS RatingCount, 31 AS Stock, 39 AS Sold
UNION ALL
SELECT 'Samsung Galaxy Z Flip5' AS Name, 'samsung-galaxy-z-flip5' AS Slug, 'Compact foldable smartphone' AS Description, 19990000 AS Price, 16992000 AS Disc, 'Phones' AS Cat, 'Samsung' AS Brand, 2 AS ShopIdx, 4.6 AS Rating, 230 AS RatingCount, 38 AS Stock, 52 AS Sold
UNION ALL
SELECT 'HP Pavilion 15' AS Name, 'hp-pavilion-15' AS Slug, 'Everyday laptop, 16GB RAM' AS Description, 16490000 AS Price, 15006000 AS Disc, 'Laptops' AS Cat, 'HP' AS Brand, 6 AS ShopIdx, 4.4 AS Rating, 340 AS RatingCount, 45 AS Stock, 5 AS Sold
UNION ALL
SELECT 'Lenovo ThinkPad E14' AS Name, 'lenovo-thinkpad-e14' AS Slug, 'Business laptop with long battery life' AS Description, 18990000 AS Price, 17471000 AS Disc, 'Laptops' AS Cat, 'Lenovo' AS Brand, 6 AS ShopIdx, 4.5 AS Rating, 260 AS RatingCount, 12 AS Stock, 18 AS Sold
UNION ALL
SELECT 'ASUS Vivobook 15' AS Name, 'asus-vivobook-15' AS Slug, 'Slim laptop for students' AS Description, 12990000 AS Price, 11691000 AS Disc, 'Laptops' AS Cat, 'ASUS' AS Brand, 6 AS ShopIdx, 4.4 AS Rating, 510 AS RatingCount, 19 AS Stock, 31 AS Sold
UNION ALL
SELECT 'Dell Inspiron 14' AS Name, 'dell-inspiron-14' AS Slug, 'Reliable 14-inch laptop' AS Description, 14490000 AS Price, 13476000 AS Disc, 'Laptops' AS Cat, 'Dell' AS Brand, 6 AS ShopIdx, 4.3 AS Rating, 290 AS RatingCount, 26 AS Stock, 44 AS Sold
UNION ALL
SELECT 'MacBook Pro 14 M3' AS Name, 'macbook-pro-14-m3' AS Slug, 'Pro laptop for creators' AS Description, 42990000 AS Price, 40411000 AS Disc, 'Laptops' AS Cat, 'Apple' AS Brand, 6 AS ShopIdx, 4.9 AS Rating, 180 AS RatingCount, 33 AS Stock, 57 AS Sold
UNION ALL
SELECT 'JBL Flip 6' AS Name, 'jbl-flip-6' AS Slug, 'Portable waterproof Bluetooth speaker' AS Description, 2990000 AS Price, 2542000 AS Disc, 'Audio' AS Cat, 'JBL' AS Brand, 5 AS ShopIdx, 4.7 AS Rating, 1300 AS RatingCount, 40 AS Stock, 10 AS Sold
UNION ALL
SELECT 'JBL Tune 520BT' AS Name, 'jbl-tune-520bt' AS Slug, 'Wireless on-ear headphones' AS Description, 990000 AS Price, 792000 AS Disc, 'Audio' AS Cat, 'JBL' AS Brand, 5 AS ShopIdx, 4.4 AS Rating, 870 AS RatingCount, 47 AS Stock, 23 AS Sold
UNION ALL
SELECT 'Sony WF-1000XM5' AS Name, 'sony-wf-1000xm5' AS Slug, 'Premium noise cancelling earbuds' AS Description, 6990000 AS Price, 6291000 AS Disc, 'Audio' AS Cat, 'Sony' AS Brand, 5 AS ShopIdx, 4.8 AS Rating, 420 AS RatingCount, 14 AS Stock, 36 AS Sold
UNION ALL
SELECT 'Xiaomi Smart Band 8' AS Name, 'xiaomi-smart-band-8' AS Slug, 'Fitness tracker with AMOLED screen' AS Description, 990000 AS Price, 871000 AS Disc, 'Audio' AS Cat, 'Xiaomi' AS Brand, 5 AS ShopIdx, 4.5 AS Rating, 1500 AS RatingCount, 21 AS Stock, 49 AS Sold
UNION ALL
SELECT 'Philips Air Fryer XL' AS Name, 'philips-air-fryer-xl' AS Slug, '6.2L digital air fryer' AS Description, 3290000 AS Price, 2698000 AS Disc, 'Home Appliances' AS Cat, 'Philips' AS Brand, 5 AS ShopIdx, 4.7 AS Rating, 980 AS RatingCount, 28 AS Stock, 2 AS Sold
UNION ALL
SELECT 'Panasonic Rice Cooker 1.8L' AS Name, 'panasonic-rice-cooker-1-8l' AS Slug, 'Non-stick inner pot rice cooker' AS Description, 1890000 AS Price, 1701000 AS Disc, 'Home Appliances' AS Cat, 'Panasonic' AS Brand, 5 AS ShopIdx, 4.6 AS Rating, 640 AS RatingCount, 35 AS Stock, 15 AS Sold
UNION ALL
SELECT 'LG Inverter Washing Machine 9kg' AS Name, 'lg-inverter-washing-machine-9kg' AS Slug, 'Front load washer with AI DD' AS Description, 10990000 AS Price, 9671000 AS Disc, 'Home Appliances' AS Cat, 'LG' AS Brand, 5 AS ShopIdx, 4.7 AS Rating, 210 AS RatingCount, 42 AS Stock, 28 AS Sold
UNION ALL
SELECT 'Xiaomi Robot Vacuum S10' AS Name, 'xiaomi-robot-vacuum-s10' AS Slug, 'Smart robot vacuum and mop' AS Description, 5990000 AS Price, 5092000 AS Disc, 'Home Appliances' AS Cat, 'Xiaomi' AS Brand, 5 AS ShopIdx, 4.5 AS Rating, 330 AS RatingCount, 49 AS Stock, 41 AS Sold
UNION ALL
SELECT 'Philips Electric Kettle' AS Name, 'philips-electric-kettle' AS Slug, '1.7L stainless steel kettle' AS Description, 690000 AS Price, 621000 AS Disc, 'Kitchen' AS Cat, 'Philips' AS Brand, 5 AS ShopIdx, 4.4 AS Rating, 720 AS RatingCount, 16 AS Stock, 54 AS Sold
UNION ALL
SELECT 'Sunhouse Non-stick Pan Set' AS Name, 'sunhouse-non-stick-pan-set' AS Slug, '3-piece non-stick cookware set' AS Description, 790000 AS Price, 632000 AS Disc, 'Kitchen' AS Cat, 'Sunhouse' AS Brand, 5 AS ShopIdx, 4.3 AS Rating, 540 AS RatingCount, 23 AS Stock, 7 AS Sold
UNION ALL
SELECT 'Panasonic Microwave 25L' AS Name, 'panasonic-microwave-25l' AS Slug, 'Digital microwave oven' AS Description, 2490000 AS Price, 2241000 AS Disc, 'Kitchen' AS Cat, 'Panasonic' AS Brand, 5 AS ShopIdx, 4.5 AS Rating, 260 AS RatingCount, 30 AS Stock, 20 AS Sold
UNION ALL
SELECT 'L''Oreal Revitalift Serum' AS Name, 'l-oreal-revitalift-serum' AS Slug, 'Hyaluronic acid anti-aging serum' AS Description, 420000 AS Price, 357000 AS Disc, 'Beauty' AS Cat, 'L''Oreal' AS Brand, 4 AS ShopIdx, 4.6 AS Rating, 1900 AS RatingCount, 37 AS Stock, 33 AS Sold
UNION ALL
SELECT 'L''Oreal Paris Shampoo 650ml' AS Name, 'l-oreal-paris-shampoo-650ml' AS Slug, 'Repair shampoo for damaged hair' AS Description, 189000 AS Price, 170000 AS Disc, 'Beauty' AS Cat, 'L''Oreal' AS Brand, 4 AS ShopIdx, 4.5 AS Rating, 2300 AS RatingCount, 44 AS Stock, 46 AS Sold
UNION ALL
SELECT 'L''Oreal Matte Lipstick' AS Name, 'l-oreal-matte-lipstick' AS Slug, 'Long-lasting matte lipstick' AS Description, 290000 AS Price, 255000 AS Disc, 'Beauty' AS Cat, 'L''Oreal' AS Brand, 4 AS ShopIdx, 4.4 AS Rating, 1100 AS RatingCount, 11 AS Stock, 59 AS Sold
UNION ALL
SELECT 'Philips Hair Dryer 2200W' AS Name, 'philips-hair-dryer-2200w' AS Slug, 'Fast-drying ionic hair dryer' AS Description, 690000 AS Price, 587000 AS Disc, 'Beauty' AS Cat, 'Philips' AS Brand, 4 AS ShopIdx, 4.5 AS Rating, 430 AS RatingCount, 18 AS Stock, 12 AS Sold
UNION ALL
SELECT 'Atomic Habits' AS Name, 'atomic-habits' AS Slug, 'Tiny changes, remarkable results' AS Description, 189000 AS Price, 170000 AS Disc, 'Books' AS Cat, 'Nha Nam' AS Brand, 4 AS ShopIdx, 4.9 AS Rating, 3200 AS RatingCount, 25 AS Stock, 25 AS Sold
UNION ALL
SELECT 'Dac Nhan Tam' AS Name, 'dac-nhan-tam' AS Slug, 'Classic book on human relations' AS Description, 99000 AS Price, 94000 AS Disc, 'Books' AS Cat, 'Nha Nam' AS Brand, 4 AS ShopIdx, 4.8 AS Rating, 5100 AS RatingCount, 32 AS Stock, 38 AS Sold
UNION ALL
SELECT 'Nha Gia Kim' AS Name, 'nha-gia-kim' AS Slug, 'Paulo Coelho bestselling novel' AS Description, 79000 AS Price, 75000 AS Disc, 'Books' AS Cat, 'Nha Nam' AS Brand, 4 AS ShopIdx, 4.8 AS Rating, 4800 AS RatingCount, 39 AS Stock, 51 AS Sold
UNION ALL
SELECT 'Sapiens: A Brief History of Humankind' AS Name, 'sapiens-a-brief-history-of-humankind' AS Slug, 'Yuval Noah Harari' AS Description, 219000 AS Price, 197000 AS Disc, 'Books' AS Cat, 'Nha Nam' AS Brand, 4 AS ShopIdx, 4.8 AS Rating, 2600 AS RatingCount, 46 AS Stock, 4 AS Sold
UNION ALL
SELECT 'Nike Dri-FIT Running Tee' AS Name, 'nike-dri-fit-running-tee' AS Slug, 'Breathable running shirt' AS Description, 690000 AS Price, 587000 AS Disc, 'Sports' AS Cat, 'Nike' AS Brand, 4 AS ShopIdx, 4.5 AS Rating, 640 AS RatingCount, 13 AS Stock, 17 AS Sold
UNION ALL
SELECT 'Adidas Predator Football Boots' AS Name, 'adidas-predator-football-boots' AS Slug, 'Turf football shoes' AS Description, 2490000 AS Price, 2042000 AS Disc, 'Sports' AS Cat, 'Adidas' AS Brand, 4 AS ShopIdx, 4.6 AS Rating, 380 AS RatingCount, 20 AS Stock, 30 AS Sold
UNION ALL
SELECT 'Decathlon Yoga Mat 8mm' AS Name, 'decathlon-yoga-mat-8mm' AS Slug, 'Non-slip yoga mat' AS Description, 299000 AS Price, 269000 AS Disc, 'Sports' AS Cat, 'Decathlon' AS Brand, 4 AS ShopIdx, 4.4 AS Rating, 910 AS RatingCount, 27 AS Stock, 43 AS Sold
UNION ALL
SELECT 'Decathlon Dumbbell Set 20kg' AS Name, 'decathlon-dumbbell-set-20kg' AS Slug, 'Adjustable dumbbell set' AS Description, 890000 AS Price, 783000 AS Disc, 'Sports' AS Cat, 'Decathlon' AS Brand, 4 AS ShopIdx, 4.5 AS Rating, 420 AS RatingCount, 34 AS Stock, 56 AS Sold
UNION ALL
SELECT 'Puma Running Shorts' AS Name, 'puma-running-shorts' AS Slug, 'Lightweight sports shorts' AS Description, 390000 AS Price, 332000 AS Disc, 'Sports' AS Cat, 'Puma' AS Brand, 4 AS ShopIdx, 4.3 AS Rating, 520 AS RatingCount, 41 AS Stock, 9 AS Sold
UNION ALL
SELECT 'Puma RS-X Sneakers' AS Name, 'puma-rs-x-sneakers' AS Slug, 'Retro chunky sneakers' AS Description, 2790000 AS Price, 2232000 AS Disc, 'Shoes' AS Cat, 'Puma' AS Brand, 3 AS ShopIdx, 4.5 AS Rating, 430 AS RatingCount, 48 AS Stock, 22 AS Sold
UNION ALL
SELECT 'Adidas Stan Smith' AS Name, 'adidas-stan-smith' AS Slug, 'Iconic leather sneakers' AS Description, 2490000 AS Price, 2117000 AS Disc, 'Shoes' AS Cat, 'Adidas' AS Brand, 3 AS ShopIdx, 4.8 AS Rating, 1700 AS RatingCount, 15 AS Stock, 35 AS Sold
UNION ALL
SELECT 'Nike Pegasus 40' AS Name, 'nike-pegasus-40' AS Slug, 'Everyday running shoes' AS Description, 3490000 AS Price, 3071000 AS Disc, 'Shoes' AS Cat, 'Nike' AS Brand, 3 AS ShopIdx, 4.7 AS Rating, 820 AS RatingCount, 22 AS Stock, 48 AS Sold
UNION ALL
SELECT 'Uniqlo Airism T-Shirt' AS Name, 'uniqlo-airism-t-shirt' AS Slug, 'Cool and breathable tee' AS Description, 249000 AS Price, 224000 AS Disc, 'Fashion' AS Cat, 'Uniqlo' AS Brand, 3 AS ShopIdx, 4.6 AS Rating, 2100 AS RatingCount, 29 AS Stock, 1 AS Sold
UNION ALL
SELECT 'Uniqlo Ultra Light Down Jacket' AS Name, 'uniqlo-ultra-light-down-jacket' AS Slug, 'Packable warm jacket' AS Description, 1290000 AS Price, 1097000 AS Disc, 'Fashion' AS Cat, 'Uniqlo' AS Brand, 3 AS ShopIdx, 4.7 AS Rating, 1400 AS RatingCount, 36 AS Stock, 14 AS Sold
UNION ALL
SELECT 'Adidas Essentials Joggers' AS Name, 'adidas-essentials-joggers' AS Slug, 'Comfortable cotton joggers' AS Description, 990000 AS Price, 812000 AS Disc, 'Fashion' AS Cat, 'Adidas' AS Brand, 3 AS ShopIdx, 4.4 AS Rating, 610 AS RatingCount, 43 AS Stock, 27 AS Sold
UNION ALL
SELECT 'Lego Classic Creative Bricks' AS Name, 'lego-classic-creative-bricks' AS Slug, '790 pieces creative building set' AS Description, 890000 AS Price, 801000 AS Disc, 'Toys' AS Cat, 'Lego' AS Brand, 7 AS ShopIdx, 4.8 AS Rating, 720 AS RatingCount, 10 AS Stock, 40 AS Sold
UNION ALL
SELECT 'Lego Technic Race Car' AS Name, 'lego-technic-race-car' AS Slug, 'Buildable pull-back race car' AS Description, 1290000 AS Price, 1135000 AS Disc, 'Toys' AS Cat, 'Lego' AS Brand, 7 AS ShopIdx, 4.7 AS Rating, 380 AS RatingCount, 17 AS Stock, 53 AS Sold
UNION ALL
SELECT 'Lego Star Wars Mandalorian Helmet' AS Name, 'lego-star-wars-mandalorian-helmet' AS Slug, 'Collectible display set' AS Description, 1690000 AS Price, 1521000 AS Disc, 'Toys' AS Cat, 'Lego' AS Brand, 7 AS ShopIdx, 4.9 AS Rating, 260 AS RatingCount, 24 AS Stock, 6 AS Sold
UNION ALL
SELECT 'Logitech G102 Gaming Mouse' AS Name, 'logitech-g102-gaming-mouse' AS Slug, 'RGB wired gaming mouse' AS Description, 390000 AS Price, 332000 AS Disc, 'Accessories' AS Cat, 'Logitech' AS Brand, 7 AS ShopIdx, 4.6 AS Rating, 2600 AS RatingCount, 31 AS Stock, 19 AS Sold
UNION ALL
SELECT 'Logitech K380 Keyboard' AS Name, 'logitech-k380-keyboard' AS Slug, 'Multi-device Bluetooth keyboard' AS Description, 790000 AS Price, 711000 AS Disc, 'Accessories' AS Cat, 'Logitech' AS Brand, 7 AS ShopIdx, 4.7 AS Rating, 1800 AS RatingCount, 38 AS Stock, 32 AS Sold
UNION ALL
SELECT 'Logitech C920 Webcam' AS Name, 'logitech-c920-webcam' AS Slug, 'Full HD webcam' AS Description, 1790000 AS Price, 1575000 AS Disc, 'Accessories' AS Cat, 'Logitech' AS Brand, 7 AS ShopIdx, 4.6 AS Rating, 940 AS RatingCount, 45 AS Stock, 45 AS Sold
UNION ALL
SELECT 'ASUS TUF Gaming Monitor 27in' AS Name, 'asus-tuf-gaming-monitor-27in' AS Slug, '165Hz IPS gaming monitor' AS Description, 5990000 AS Price, 5391000 AS Disc, 'Electronics' AS Cat, 'ASUS' AS Brand, 7 AS ShopIdx, 4.6 AS Rating, 330 AS RatingCount, 12 AS Stock, 58 AS Sold
UNION ALL
SELECT 'Sony PlayStation 5 Slim' AS Name, 'sony-playstation-5-slim' AS Slug, 'Next-gen gaming console' AS Description, 12990000 AS Price, 12341000 AS Disc, 'Electronics' AS Cat, 'Sony' AS Brand, 7 AS ShopIdx, 4.9 AS Rating, 520 AS RatingCount, 19 AS Stock, 11 AS Sold
UNION ALL
SELECT 'Sony DualSense Controller' AS Name, 'sony-dualsense-controller' AS Slug, 'Wireless PS5 controller' AS Description, 1690000 AS Price, 1521000 AS Disc, 'Electronics' AS Cat, 'Sony' AS Brand, 7 AS ShopIdx, 4.8 AS Rating, 1200 AS RatingCount, 26 AS Stock, 24 AS Sold
UNION ALL
SELECT 'Canon PIXMA G3010 Printer' AS Name, 'canon-pixma-g3010-printer' AS Slug, 'Ink tank wireless printer' AS Description, 3990000 AS Price, 3591000 AS Disc, 'Electronics' AS Cat, 'Canon' AS Brand, 8 AS ShopIdx, 4.4 AS Rating, 280 AS RatingCount, 33 AS Stock, 37 AS Sold
UNION ALL
SELECT 'Canon PowerShot G7 X III' AS Name, 'canon-powershot-g7-x-iii' AS Slug, 'Compact vlogging camera' AS Description, 19990000 AS Price, 18391000 AS Disc, 'Camera' AS Cat, 'Canon' AS Brand, 8 AS ShopIdx, 4.7 AS Rating, 150 AS RatingCount, 40 AS Stock, 50 AS Sold
UNION ALL
SELECT 'Sony ZV-E10' AS Name, 'sony-zv-e10' AS Slug, 'Mirrorless vlogging camera' AS Description, 17990000 AS Price, 16191000 AS Disc, 'Camera' AS Cat, 'Sony' AS Brand, 8 AS ShopIdx, 4.7 AS Rating, 210 AS RatingCount, 47 AS Stock, 3 AS Sold
UNION ALL
SELECT 'Canon RF 50mm f/1.8 Lens' AS Name, 'canon-rf-50mm-f-1-8-lens' AS Slug, 'Compact prime lens' AS Description, 4490000 AS Price, 4131000 AS Disc, 'Camera' AS Cat, 'Canon' AS Brand, 8 AS ShopIdx, 4.8 AS Rating, 340 AS RatingCount, 14 AS Stock, 16 AS Sold
UNION ALL
SELECT 'IKEA Markus Office Chair' AS Name, 'ikea-markus-office-chair' AS Slug, 'Ergonomic mesh office chair' AS Description, 4990000 AS Price, 4491000 AS Disc, 'Furniture' AS Cat, 'IKEA' AS Brand, 1 AS ShopIdx, 4.6 AS Rating, 260 AS RatingCount, 21 AS Stock, 29 AS Sold
UNION ALL
SELECT 'IKEA Kallax Shelf Unit' AS Name, 'ikea-kallax-shelf-unit' AS Slug, 'Versatile 2x4 shelving unit' AS Description, 2490000 AS Price, 2291000 AS Disc, 'Furniture' AS Cat, 'IKEA' AS Brand, 1 AS ShopIdx, 4.7 AS Rating, 410 AS RatingCount, 28 AS Stock, 42 AS Sold
UNION ALL
SELECT 'IKEA Bekant Desk 160cm' AS Name, 'ikea-bekant-desk-160cm' AS Slug, 'Spacious work desk' AS Description, 3990000 AS Price, 3591000 AS Disc, 'Furniture' AS Cat, 'IKEA' AS Brand, 1 AS ShopIdx, 4.5 AS Rating, 190 AS RatingCount, 35 AS Stock, 55 AS Sold
UNION ALL
SELECT 'Xiaomi Desk Lamp 1S' AS Name, 'xiaomi-desk-lamp-1s' AS Slug, 'Smart LED desk lamp' AS Description, 590000 AS Price, 519000 AS Disc, 'Furniture' AS Cat, 'Xiaomi' AS Brand, 1 AS ShopIdx, 4.6 AS Rating, 640 AS RatingCount, 42 AS Stock, 8 AS Sold
UNION ALL
SELECT 'Apple iPad 10th Gen' AS Name, 'apple-ipad-10th-gen' AS Slug, '10.9-inch tablet' AS Description, 9990000 AS Price, 9191000 AS Disc, 'Electronics' AS Cat, 'Apple' AS Brand, 5 AS ShopIdx, 4.8 AS Rating, 540 AS RatingCount, 49 AS Stock, 21 AS Sold
UNION ALL
SELECT 'Samsung Galaxy Tab S9 FE' AS Name, 'samsung-galaxy-tab-s9-fe' AS Slug, 'Tablet with S Pen included' AS Description, 10990000 AS Price, 9891000 AS Disc, 'Electronics' AS Cat, 'Samsung' AS Brand, 5 AS ShopIdx, 4.6 AS Rating, 230 AS RatingCount, 16 AS Stock, 34 AS Sold
UNION ALL
SELECT 'Apple AirTag 4-pack' AS Name, 'apple-airtag-4-pack' AS Slug, 'Item tracker 4 pack' AS Description, 2990000 AS Price, 2841000 AS Disc, 'Accessories' AS Cat, 'Apple' AS Brand, 5 AS ShopIdx, 4.7 AS Rating, 610 AS RatingCount, 23 AS Stock, 47 AS Sold
UNION ALL
SELECT 'Anker 20000mAh Power Bank' AS Name, 'anker-20000mah-power-bank' AS Slug, 'Fast-charging portable charger' AS Description, 990000 AS Price, 891000 AS Disc, 'Accessories' AS Cat, 'Xiaomi' AS Brand, 5 AS ShopIdx, 4.6 AS Rating, 1400 AS RatingCount, 30 AS Stock, 0 AS Sold;

INSERT IGNORE INTO Products (ShopId, RetailerId, Name, Slug, Description, Price, DiscountPrice, CategoryId, BrandId, Image, RatingAvg, RatingCount, Status, CreatedAt, UpdatedAt)
SELECT s.ShopId, s.OwnerId, t.Name, t.Slug, t.Description, t.Price, t.Disc,
       (SELECT MIN(CategoryId) FROM Categories WHERE Type = t.Cat),
       (SELECT MIN(BrandId) FROM Brands WHERE Name = t.Brand),
       CONCAT('https://picsum.photos/seed/', t.Slug, '/600/600'),
       t.Rating, t.RatingCount, 'ACTIVE', NOW(), NOW()
FROM tmp_seed t
JOIN (SELECT ShopId, OwnerId, ROW_NUMBER() OVER (ORDER BY ShopId) AS rn FROM Shops) s
  ON s.rn = ((t.ShopIdx - 1) % (SELECT COUNT(*) FROM Shops)) + 1;

-- Two variants per product (Black / White)
INSERT INTO Product_variants (ProductId, SKU, Price)
SELECT p.ProductId, CONCAT(p.Slug, v.sfx), ROUND(p.DiscountPrice * v.mult / 1000) * 1000
FROM Products p
JOIN tmp_seed t ON t.Slug = p.Slug
JOIN (SELECT '-blk' AS sfx, 1.00 AS mult UNION ALL SELECT '-wht', 1.03) v
WHERE NOT EXISTS (SELECT 1 FROM Product_variants pv WHERE pv.SKU = CONCAT(p.Slug, v.sfx));

INSERT IGNORE INTO Variant_attributes (VariantId, ValueId)
SELECT pv.VariantId,
       (SELECT MIN(ValueId) FROM Attribute_values WHERE Value = IF(pv.SKU LIKE '%-blk', 'Black', 'White'))
FROM Product_variants pv
JOIN Products p ON p.ProductId = pv.ProductId
JOIN tmp_seed t ON t.Slug = p.Slug
WHERE (SELECT MIN(ValueId) FROM Attribute_values WHERE Value = IF(pv.SKU LIKE '%-blk', 'Black', 'White')) IS NOT NULL;

INSERT IGNORE INTO Inventories (ProductVariantId, AvailableStock, ReservedStock, SoldStock)
SELECT pv.VariantId, t.Stock, 0, t.Sold
FROM Product_variants pv
JOIN Products p ON p.ProductId = pv.ProductId
JOIN tmp_seed t ON t.Slug = p.Slug;

-- Product_images has no unique key: clear this seed's images, then insert 2 per product
DELETE FROM Product_images WHERE ProductId IN (SELECT p.ProductId FROM Products p JOIN tmp_seed t ON t.Slug = p.Slug);
INSERT INTO Product_images (ProductId, VariantId, ImageUrl, IsPrimary, SortOrder)
SELECT p.ProductId, NULL, CONCAT('https://picsum.photos/seed/', p.Slug, i.sfx, '/600/600'), i.pri, i.ord
FROM Products p
JOIN tmp_seed t ON t.Slug = p.Slug
JOIN (SELECT '' AS sfx, 1 AS pri, 0 AS ord UNION ALL SELECT '-2', 0, 1) i;

DROP TEMPORARY TABLE tmp_seed;
