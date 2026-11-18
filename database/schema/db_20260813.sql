USE veloramall;

ALTER TABLE Order_items
ADD COLUMN SellerStatus VARCHAR(20) DEFAULT 'pending';
CREATE INDEX idx_order_items_shop_status ON Order_items (ShopId, SellerStatus);

ALTER TABLE Order_Tracking
ADD COLUMN ShopId BIGINT NULL AFTER OrderId;

ALTER TABLE Order_Tracking
ADD CONSTRAINT FK_OrderTracking_Shop
FOREIGN KEY (ShopId) REFERENCES Shops(ShopId);

CREATE INDEX idx_tracking_shop_order
ON Order_Tracking(ShopId, OrderId);