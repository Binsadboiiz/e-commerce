ALTER TABLE Products
    MODIFY COLUMN Status ENUM(
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'DELETED'
    ) DEFAULT 'ACTIVE';

UPDATE Products
SET Status = 'ACTIVE'
WHERE Status = 'active';