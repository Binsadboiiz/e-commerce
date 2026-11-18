-- Tạo bảng Accounts

USE VeloraMall;

CREATE TABLE Accounts (
    AccountId BIGINT AUTO_INCREMENT PRIMARY KEY,

    UserId VARCHAR(50) NOT NULL,

    Username VARCHAR(100) UNIQUE NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,

    PasswordHash VARCHAR(500) NOT NULL,
    OldPasswordHash VARCHAR(500) NULL,

    Role VARCHAR(50) NOT NULL,

    RefreshToken VARCHAR(1000) NULL,
    RefreshTokenExpiry DATETIME NULL,

    IsVerified TINYINT(1) DEFAULT 0,
    IsActive TINYINT(1) DEFAULT 1,

    LastLoginAt DATETIME NULL,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Accounts_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE
);

CREATE INDEX idx_accounts_email ON Accounts(Email);
CREATE INDEX idx_accounts_role ON Accounts(Role);

alter table Users
drop column Password
alter table Users
drop column Role