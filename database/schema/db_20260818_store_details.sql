use veloramall;
go

CREATE TABLE StoreDetails
(
    ShopId BIGINT NOT NULL PRIMARY KEY,

    StoreAddress VARCHAR(255) NOT NULL,
    StoreCity VARCHAR(100) NOT NULL,
    StoreState VARCHAR(50) NOT NULL,
    StoreZipCode VARCHAR(20) NOT NULL,

    StorePhone VARCHAR(20),
    StoreEmail VARCHAR(100),

    CONSTRAINT FK_StoreDetails_Shops
        FOREIGN KEY (ShopId)
        REFERENCES Shops(ShopId)
        ON DELETE CASCADE
);
