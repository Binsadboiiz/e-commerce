-- VeloraMall Database Schema v3
-- Updated: 2026-04-14

-- Changes:
-- 1. changed price and discountprice to decimal(18,2)
-- 2. added status values out_of_stock and deleted
-- 3. changed description to text
-- 4. changed image to varchar(1000)
-- 5. added createdat and updatedat
-- 6. added indexes

ALTER TABLE Products
MODIFY Price DECIMAL(18,2),
MODIFY DiscountPrice DECIMAL(18,2);

ALTER TABLE Order_items
MODIFY Price DECIMAL(18,2);

ALTER TABLE Products
MODIFY Status ENUM('active','inactive','out_of_stock','deleted') DEFAULT 'active';

ALTER TABLE Products
MODIFY Description TEXT;

ALTER TABLE Products
ADD CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE INDEX idx_products_name ON Products(Name);
CREATE INDEX idx_products_category ON Products(CategoryId);
CREATE INDEX idx_products_price ON Products(Price);
CREATE INDEX idx_products_status ON Products(Status);