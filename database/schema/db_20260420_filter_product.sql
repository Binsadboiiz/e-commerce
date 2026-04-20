-- VeloraMall Database Schema (Attribute System)
-- Updated: 2026-04-20
--
-- Changes:
-- 1. Added Attributes table (define attribute types: Color, Size, Material)
-- 2. Added Attribute_values table (store attribute values)
-- 3. Added Product_attributes (for filtering products)
-- 4. Added Variant_attributes (map variant to attribute values)
-- 5. Added indexes for filtering performance
-- 6. Added ON DELETE CASCADE for data integrity

-- ========================
-- ATTRIBUTES (Attribute Types)
-- ========================
CREATE TABLE Attributes (
    AttributeId BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL   
);

-- ========================
-- ATTRIBUTE VALUES
-- ========================
CREATE TABLE Attribute_values (
    ValueId BIGINT AUTO_INCREMENT PRIMARY KEY,
    AttributeId BIGINT NOT NULL,
    Value VARCHAR(100) NOT NULL, 

    FOREIGN KEY (AttributeId) REFERENCES Attributes(AttributeId) ON DELETE CASCADE
);

-- ========================
-- PRODUCT ATTRIBUTES 
-- ========================
CREATE TABLE Product_attributes (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ProductId BIGINT NOT NULL,
    ValueId BIGINT NOT NULL,

    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE,
    FOREIGN KEY (ValueId) REFERENCES Attribute_values(ValueId) ON DELETE CASCADE
);

-- ========================
-- VARIANT ATTRIBUTES 
-- ========================
CREATE TABLE Variant_attributes (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    VariantId BIGINT NOT NULL,
    ValueId BIGINT NOT NULL,

    FOREIGN KEY (VariantId) REFERENCES Product_variants(VariantId) ON DELETE CASCADE,
    FOREIGN KEY (ValueId) REFERENCES Attribute_values(ValueId) ON DELETE CASCADE
);

-- ========================
-- INDEXES 
-- ========================
CREATE INDEX idx_attr_value ON Attribute_values(Value);
CREATE INDEX idx_attr_type ON Attribute_values(AttributeId);

CREATE INDEX idx_product_attr_product ON Product_attributes(ProductId);
CREATE INDEX idx_product_attr_value ON Product_attributes(ValueId);

CREATE INDEX idx_variant_attr_variant ON Variant_attributes(VariantId);
CREATE INDEX idx_variant_attr_value ON Variant_attributes(ValueId);