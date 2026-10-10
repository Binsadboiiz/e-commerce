using BE.Models.Entities;

namespace BE.Repositories.Interfaces
{
    /// <summary>
    /// Provides data access for seller registration.
    /// </summary>
    public interface ISellerRepository
    {
        // Seller Account
        Task<SellerAccount?> GetByUserIdAsync(string userId);

        Task<SellerAccount?> GetBySellerIdAsync(string sellerId);

        Task<bool> HasShopAsync(string userId);

        Task AddSellerAsync(SellerAccount seller);

        // Master Data
        Task<SellerType?> GetSellerTypeAsync(int sellerTypeId);

        Task<SellerStatus?> GetSellerStatusByCodeAsync(string code);

        // Address
        Task<SellerAddress?> GetAddressAsync(string sellerId);
        Task AddAddressAsync(SellerAddress address);

        // Bank
        Task<SellerBank?> GetPrimaryBankAsync(string sellerId);
        Task AddBankAsync(SellerBank bank);

        // Business
        Task<SellerBusiness?> GetBusinessAsync(string sellerId);
        Task AddBusinessAsync(SellerBusiness business);

        // Document Type
        Task<SellerDocumentType?> GetDocumentTypeAsync(int documentTypeId);

        // Documents
        Task<List<SellerDocument>> GetDocumentsAsync(string sellerId);


        Task<SellerDocument?> GetDocumentAsync(long documentId);

        Task AddDocumentAsync(SellerDocument document);

        void RemoveDocument(SellerDocument document);

        Task SaveChangesAsync();

        Task ClearRegistrationAsync(string sellerId);
    }
}