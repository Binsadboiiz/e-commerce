-- =========================================================================
-- VELORAMALL DATABASE UPDATE - VOUCHER TYPE & SCOPE
-- Generated on: 2026-08-09
-- Description: Adds VoucherType, CategoryId, ShopId, UsageLimit, and UsageCount
--              columns to the Vouchers table.
-- =========================================================================

USE VeloraMall;

ALTER TABLE Vouchers
ADD COLUMN VoucherType VARCHAR(20) NOT NULL DEFAULT 'AllItems',
ADD COLUMN CategoryId BIGINT NULL,
ADD COLUMN ShopId BIGINT NULL,
ADD COLUMN UsageLimit INT NULL,
ADD COLUMN UsageCount INT NOT NULL DEFAULT 0,
ADD CONSTRAINT FK_Vouchers_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId) ON DELETE SET NULL,
ADD CONSTRAINT FK_Vouchers_Shops FOREIGN KEY (ShopId) REFERENCES Shops(ShopId) ON DELETE CASCADE;
