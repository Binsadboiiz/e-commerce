-- =========================================================================
-- SELLER REGISTRATION SYSTEM SEED DATA UPDATE (2026-10-10)
-- Table Clearing & System Master Data Setup (English Version)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================
-- CLEAR SELLER REGISTRATION TABLES
-- =========================================
TRUNCATE TABLE Seller_documents;
TRUNCATE TABLE Seller_businesses;
TRUNCATE TABLE Seller_banks;
TRUNCATE TABLE Seller_addresses;
TRUNCATE TABLE Seller_accounts;
TRUNCATE TABLE Seller_document_types;
TRUNCATE TABLE Seller_statuses;
TRUNCATE TABLE Seller_types;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- 1. SELLER TYPES
-- =========================================
INSERT INTO Seller_types (
    SellerTypeId,
    Code,
    Name,
    Description,
    IsActive,
    CreatedAt,
    UpdatedAt
) VALUES
(1, 'PERSONAL', 'Personal Store', 'For individuals, small sellers, or independent shops without a business registration certificate.', 1, NOW(), NOW()),
(2, 'BUSINESS', 'Business Store', 'For companies, organizations, or official brand distributors with a valid business registration certificate.', 1, NOW(), NOW());

-- =========================================
-- 2. SELLER STATUSES
-- =========================================
INSERT INTO Seller_statuses (
    SellerStatusId,
    Code,
    Name,
    Description,
    DisplayOrder,
    IsActive,
    CreatedAt,
    UpdatedAt
) VALUES
(1, 'DRAFT', 'Draft', 'Registration information is currently being filled.', 1, 1, NOW(), NOW()),
(2, 'PENDING', 'Pending', 'Submitted registration awaiting verification.', 2, 1, NOW(), NOW()),
(3, 'UNDER_REVIEW', 'Under Review', 'Application is currently under review by verification team.', 3, 1, NOW(), NOW()),
(4, 'APPROVED', 'Approved', 'Registration successful, store activated.', 4, 1, NOW(), NOW()),
(5, 'REJECTED', 'Rejected', 'Application rejected, requires additional edits.', 5, 1, NOW(), NOW()),
(6, 'SUSPENDED', 'Suspended', 'Store operations are temporarily suspended.', 6, 1, NOW(), NOW()),
(7, 'BANNED', 'Banned', 'Store permanently banned due to terms of service violation.', 7, 1, NOW(), NOW()),
(8, 'CLOSED', 'Closed', 'Store voluntarily closed by seller.', 8, 1, NOW(), NOW());

-- =========================================
-- 3. SELLER DOCUMENT TYPES
-- =========================================
INSERT INTO Seller_document_types (
    DocumentTypeId,
    Code,
    Name,
    Description,
    DisplayOrder,
    IsActive
) VALUES
(1, 'IDENTITY_FRONT', 'ID / Passport Front', 'Front side of ID card / Citizen Identity Card / Passport', 1, 1),
(2, 'IDENTITY_BACK', 'ID / Passport Back', 'Back side of ID card / Citizen Identity Card / Passport', 2, 1),
(3, 'SELFIE', 'Selfie with ID', 'Portrait photo holding ID card / Citizen Identity Card', 3, 1),
(4, 'BUSINESS_LICENSE', 'Business License', 'Official Business Registration Certificate', 4, 1);

-- =========================================
-- 4. SYSTEM ADMIN ACCOUNT
-- =========================================
-- Email: admin@polarisx.com
-- Username: admin
-- Default Password: Admin123!
-- Role: Admin (Case-sensitive match with RoleConstants.Admin)

INSERT INTO Users (
    UserId,
    Email,
    FullName,
    Phone,
    Avatar,
    IsActive
) VALUES (
    'usr_admin_0000000000000000000001',
    'admin@polarisx.com',
    'System Administrator',
    '0988888888',
    NULL,
    1
) ON DUPLICATE KEY UPDATE FullName = VALUES(FullName);

INSERT INTO Accounts (
    UserId,
    Username,
    Email,
    PasswordHash,
    Role,
    IsVerified,
    IsActive,
    CreatedAt,
    UpdatedAt
) VALUES (
    'usr_admin_0000000000000000000001',
    'admin',
    'admin@polarisx.com',
    '$2a$11$PMpAk1Fd.1v.PiWxiuIszOLd6Ug9Gna7Ec6PWNZxL8OuTVlhyOmoS',
    'Admin',
    1,
    1,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash), Role = VALUES(Role);

