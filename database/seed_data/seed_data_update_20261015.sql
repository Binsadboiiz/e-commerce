-- =========================================================================
-- ORDER & TRACKING STATUS SCHEMA UPDATE (2026-10-15)
-- Support All Order Workflow & Tracking Statuses (Pending, Confirmed, Preparing, Shipped, In Transit, Out for Delivery, Delivered, Delivery Failed, Cancelled)
-- =========================================================================

-- 1. Alter Orders.Status from ENUM to VARCHAR(50) to allow full order lifecycle statuses
ALTER TABLE Orders MODIFY COLUMN Status VARCHAR(50) NOT NULL DEFAULT 'pending';

-- 2. Alter Order_items.SellerStatus to VARCHAR(50) for tracking status safety
ALTER TABLE Order_items MODIFY COLUMN SellerStatus VARCHAR(50) NOT NULL DEFAULT 'pending';
