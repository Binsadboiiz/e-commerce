-- VeloraMall checkout COD schema update
-- Date: 2026-04-16
-- Purpose:
--   1. Align Orders with checkout pricing fields used by backend.
--   2. Extend Order_items so buy-now and cart checkout can snapshot variant info.
--   3. Create payment/voucher tables used by the checkout flow.

USE VeloraMall;

-- =========================================================
-- ORDERS
-- Add detailed pricing columns used by checkout summary.
-- =========================================================
ALTER TABLE Orders
    ADD COLUMN MerchandiseSubtotal DECIMAL(18,2) NOT NULL DEFAULT 0.00 AFTER CustomerId,
    ADD COLUMN ShippingFee DECIMAL(18,2) NOT NULL DEFAULT 0.00 AFTER MerchandiseSubtotal,
    ADD COLUMN DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00 AFTER ShippingFee,
    ADD COLUMN FinalAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00 AFTER DiscountAmount;

-- If the old TotalAmount column exists, keep it for compatibility until old code is removed.
-- New code should read FinalAmount instead of TotalAmount.

-- =========================================================
-- ORDER ITEMS
-- Store variant snapshot data so the order is still readable
-- even if product/variant names change later.
-- =========================================================
ALTER TABLE Order_items
    ADD COLUMN VariantId BIGINT NULL AFTER ProductId,
    ADD COLUMN ProductImage LONGTEXT NULL AFTER ProductName,
    ADD COLUMN VariantName VARCHAR(255) NULL AFTER ProductImage,
    ADD COLUMN VariantValue VARCHAR(255) NULL AFTER VariantName;

ALTER TABLE Order_items
    ADD CONSTRAINT FK_OrderItems_ProductVariants
    FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId);

CREATE INDEX IX_OrderItems_VariantId ON Order_items (VariantId);

-- =========================================================
-- PAYMENT TRANSACTIONS
-- Each order gets one payment tracking row, even for COD.
-- =========================================================
CREATE TABLE IF NOT EXISTS PaymentTransactions (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId BIGINT NOT NULL,
    Method VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    TransactionCode VARCHAR(255) NULL,
    PaidAt DATETIME NULL,
    CONSTRAINT UQ_PaymentTransactions_OrderId UNIQUE (OrderId),
    CONSTRAINT FK_PaymentTransactions_Orders
        FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
        ON DELETE CASCADE
);

-- =========================================================
-- VOUCHERS
-- Optional support so checkout can evolve without schema changes.
-- =========================================================
CREATE TABLE IF NOT EXISTS Vouchers (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) NOT NULL,
    DiscountType VARCHAR(20) NOT NULL,
    Value DOUBLE NOT NULL,
    MaxDiscount DOUBLE NULL,
    MinOrderValue DOUBLE NULL,
    ExpiredAt DATETIME NULL,
    IsActive TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT UQ_Vouchers_Code UNIQUE (Code)
);

CREATE TABLE IF NOT EXISTS Order_Vouchers (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    OrderId BIGINT NOT NULL,
    VoucherId BIGINT NOT NULL,
    CONSTRAINT FK_OrderVouchers_Orders
        FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
        ON DELETE CASCADE,
    CONSTRAINT FK_OrderVouchers_Vouchers
        FOREIGN KEY (VoucherId) REFERENCES Vouchers(Id)
        ON DELETE RESTRICT
);

CREATE INDEX IX_OrderVouchers_OrderId ON Order_Vouchers (OrderId);
CREATE INDEX IX_OrderVouchers_VoucherId ON Order_Vouchers (VoucherId);
