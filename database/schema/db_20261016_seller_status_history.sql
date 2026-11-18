CREATE TABLE Seller_status_history (
    HistoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
    SellerId VARCHAR(50) NOT NULL,
    PreviousStatusId INT NULL,
    NewStatusId INT NOT NULL,
    ActorUserId VARCHAR(50) NOT NULL,
    Reason TEXT NULL,
    ReviewCycle INT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (SellerId)
        REFERENCES Seller_accounts(SellerId),

    FOREIGN KEY (PreviousStatusId)
        REFERENCES Seller_statuses(SellerStatusId),

    FOREIGN KEY (NewStatusId)
        REFERENCES Seller_statuses(SellerStatusId),

    FOREIGN KEY (ActorUserId)
        REFERENCES Users(UserId)
);