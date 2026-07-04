-- ========================
-- SELLER TYPES
-- ========================
CREATE TABLE Seller_types (
    SellerTypeId INT AUTO_INCREMENT PRIMARY KEY,

    Code VARCHAR(50) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255),

    DisplayOrder INT DEFAULT 0,

    IsActive BOOLEAN DEFAULT TRUE,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Seller_types
(Code, Name, Description, DisplayOrder)
VALUES
('PERSONAL','Personal','Individual seller',1),
('BUSINESS','Business','Business seller',2);

-- ========================
-- SELLER STATUSES
-- ========================
CREATE TABLE Seller_statuses (
    SellerStatusId INT AUTO_INCREMENT PRIMARY KEY,

    Code VARCHAR(50) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255),

    DisplayOrder INT DEFAULT 0,

    IsActive BOOLEAN DEFAULT TRUE,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Seller_statuses
(Code,Name,Description,DisplayOrder)
VALUES
('DRAFT','Draft','Seller registration has not been submitted.',1),
('PENDING','Pending','Waiting for verification.',2),
('UNDER_REVIEW','Under Review','Seller information is under review.',3),
('APPROVED','Approved','Seller account approved.',4),
('REJECTED','Rejected','Seller registration rejected.',5),
('SUSPENDED','Suspended','Seller account suspended.',6),
('BANNED','Banned','Seller account banned.',7),
('CLOSED','Closed','Seller account closed.',8);

-- ========================
-- SELLER ACCOUNTS
-- ========================
CREATE TABLE Seller_accounts (

    SellerId VARCHAR(50) PRIMARY KEY,

    UserId VARCHAR(50) NOT NULL UNIQUE,

    SellerTypeId INT NOT NULL,

    SellerStatusId INT NOT NULL,

    MaxShopLimit INT DEFAULT 1,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerAccounts_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,

    CONSTRAINT FK_SellerAccounts_SellerTypes
        FOREIGN KEY (SellerTypeId)
        REFERENCES Seller_types(SellerTypeId),

    CONSTRAINT FK_SellerAccounts_SellerStatuses
        FOREIGN KEY (SellerStatusId)
        REFERENCES Seller_statuses(SellerStatusId)
);

CREATE INDEX idx_seller_user
ON Seller_accounts(UserId);

CREATE INDEX idx_seller_status
ON Seller_accounts(SellerStatusId);

-- ========================
-- SELLER ADDRESSES
-- ========================
CREATE TABLE Seller_addresses (

    SellerAddressId BIGINT AUTO_INCREMENT PRIMARY KEY,

    SellerId VARCHAR(50) NOT NULL,

    FullName VARCHAR(255) NOT NULL,

    PhoneNumber VARCHAR(20) NOT NULL,

    City VARCHAR(100),

    District VARCHAR(100),

    Ward VARCHAR(100),

    StreetAddress VARCHAR(255),

    PostalCode VARCHAR(20),

    IsDefault BOOLEAN DEFAULT TRUE,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerAddresses_SellerAccounts
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE
);

CREATE INDEX idx_seller_address
ON Seller_addresses(SellerId);

-- ========================
-- SELLER DOCUMENT TYPES
-- ========================
CREATE TABLE Seller_document_types (

    DocumentTypeId INT AUTO_INCREMENT PRIMARY KEY,

    Code VARCHAR(50) UNIQUE,

    Name VARCHAR(100),

    Description VARCHAR(255),

    DisplayOrder INT DEFAULT 0,

    IsActive BOOLEAN DEFAULT TRUE
);

INSERT INTO Seller_document_types
(Code,Name,DisplayOrder)
VALUES
('CCCD_FRONT','Citizen ID Front',1),
('CCCD_BACK','Citizen ID Back',2),
('SELFIE','Selfie Verification',3),
('BUSINESS_LICENSE','Business License',4);

-- ========================
-- SELLER DOCUMENTS
-- ========================
CREATE TABLE Seller_documents (

    DocumentId BIGINT AUTO_INCREMENT PRIMARY KEY,

    SellerId VARCHAR(50) NOT NULL,

    DocumentTypeId INT NOT NULL,

    FileUrl LONGTEXT NOT NULL,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerDocuments_Seller
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE,

    CONSTRAINT FK_SellerDocuments_DocumentType
        FOREIGN KEY (DocumentTypeId)
        REFERENCES Seller_document_types(DocumentTypeId)
);

CREATE INDEX idx_seller_document
ON Seller_documents(SellerId);

-- ========================
-- SELLER BUSINESSES
-- ========================
CREATE TABLE Seller_businesses (

    BusinessId BIGINT AUTO_INCREMENT PRIMARY KEY,

    SellerId VARCHAR(50) NOT NULL UNIQUE,

    CompanyName VARCHAR(255),

    TaxCode VARCHAR(100),

    BusinessLicenseNumber VARCHAR(100),

    Representative VARCHAR(255),

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerBusinesses_Seller
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE
);

-- ========================
-- SELLER BANKS
-- ========================
CREATE TABLE Seller_banks (

    SellerBankId BIGINT AUTO_INCREMENT PRIMARY KEY,

    SellerId VARCHAR(50) NOT NULL,

    BankCode VARCHAR(50),

    AccountNumber VARCHAR(100),

    AccountName VARCHAR(255),

    IsPrimary BOOLEAN DEFAULT TRUE,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_SellerBanks_Seller
        FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId)
        ON DELETE CASCADE
);

CREATE INDEX idx_seller_bank
ON Seller_banks(SellerId);

