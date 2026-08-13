-- =========================================================
-- VeloraMall — Order Tracking & Shipping schema
-- Date   : 2026-04-19
-- Purpose:
--   1. Track every status change of an order (timeline).
--   2. Store shipping / carrier details per order.
--   3. Add EstimatedDeliveryDate to Orders table.
-- =========================================================

USE VeloraMall;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- 1. ORDER TRACKING  (one order → many tracking events)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS Order_Tracking (
    OrderTrackingId BIGINT       NOT NULL AUTO_INCREMENT,
    OrderId         BIGINT       NOT NULL,
    Status          VARCHAR(50)  NOT NULL,          -- pending, confirmed, preparing, shipped, in_transit, out_for_delivery, delivered, delivery_failed, cancelled
    Location        VARCHAR(255) NULL,              -- current location at this event
    Description     VARCHAR(500) NULL,              -- human-readable description of event
    UpdatedBy       VARCHAR(50)  NULL,              -- shop / carrier / system
    CreatedAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (OrderTrackingId),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    INDEX idx_tracking_order (OrderId),
    INDEX idx_tracking_status (Status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 2. SHIPPING DETAILS  (one order → one shipping record)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS Shipping_Details (
    Id                    BIGINT       NOT NULL AUTO_INCREMENT,
    OrderId               BIGINT       NOT NULL,
    Carrier               VARCHAR(100) NULL,        -- GHN, GHTK, J&T, ...
    TrackingCode          VARCHAR(100) NULL,        -- carrier tracking code
    CurrentLocation       VARCHAR(255) NULL,        -- last known hub / city for map-style display
    Status                VARCHAR(50)  NULL,       -- mirrors order/shipment status when updated
    ShipperId             VARCHAR(50)  NULL,        -- delivery person ID
    EstimatedDeliveryDate DATETIME     NULL,        -- ETA shown to customer (sync with Orders when set)
    UpdatedAt             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (Id),
    UNIQUE KEY uq_shipping_order (OrderId),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 3. ADD EstimatedDeliveryDate TO Orders
-- ---------------------------------------------------------
ALTER TABLE Orders
    ADD COLUMN IF NOT EXISTS EstimatedDeliveryDate DATETIME NULL AFTER Create_At;

SET FOREIGN_KEY_CHECKS = 1;
