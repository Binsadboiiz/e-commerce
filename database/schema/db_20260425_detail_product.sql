 ALTER TABLE Products 
ADD Slug VARCHAR(255) UNIQUE;

CREATE TABLE Shop_addresses (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ShopId BIGINT,
    City VARCHAR(100),
    StreetName VARCHAR(255),
    HouseNo VARCHAR(50),
    FOREIGN KEY (ShopId) REFERENCES Shops(ShopId)
);


RENAME TABLE Addresses TO User_addresses;