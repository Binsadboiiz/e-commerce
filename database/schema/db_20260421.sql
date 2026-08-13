-- =============================================
-- File: db_20260421.sql
-- Description:
-- Add Inventory table for retailer product stock management.
-- Introduce per-product-variant inventory tracking.
-- Support available, reserved and sold stock.
-- =============================================
use VeloralMall;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE Inventories (

    InventoryId BIGINT PRIMARY KEY AUTO_INCREMENT,

    ProductVariantId BIGINT NOT NULL,

    AvailableStock INT NOT NULL DEFAULT 0
        CHECK (AvailableStock >= 0),

    ReservedStock INT NOT NULL DEFAULT 0
        CHECK (ReservedStock >= 0),

    SoldStock INT NOT NULL DEFAULT 0
        CHECK (SoldStock >= 0),

    CreatedAt DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Inventories_ProductVariants
        FOREIGN KEY (ProductVariantId)
        REFERENCES Product_variants(VariantId),

    CONSTRAINT UQ_Inventories_ProductVariant
        UNIQUE(ProductVariantId)
);

CREATE INDEX IX_Inventories_ProductVariantId
ON Inventories(ProductVariantId);


--Update Product_variants table to update data type of PriceAdjustment column
ALTER TABLE Product_variants
MODIFY COLUMN PriceAdjustment DECIMAL(18,2) NOT NULL DEFAULT 0.00;