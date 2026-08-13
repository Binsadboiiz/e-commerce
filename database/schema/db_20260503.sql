ALTER TABLE Product_variants
DROP COLUMN VariantName,
DROP COLUMN VariantValue,
DROP COLUMN PriceAdjustment;

ALTER TABLE Product_variants
ADD SKU VARCHAR(100),
ADD Price DECIMAL(18,2);

ALTER TABLE Product_images
ADD VariantId BIGINT NULL;

ALTER TABLE Product_images
ADD CONSTRAINT FK_ProductImages_Variant
FOREIGN KEY (VariantId)
REFERENCES Product_variants(VariantId)
ON DELETE CASCADE;

ALTER TABLE Orders
DROP FOREIGN KEY Orders_ibfk_2;

ALTER TABLE Orders
ADD CONSTRAINT FK_Orders_UserAddress
FOREIGN KEY (AddressId)
REFERENCES User_addresses(Id);

ALTER TABLE Variant_attributes
ADD CONSTRAINT UQ_Variant_Value UNIQUE (VariantId, ValueId);