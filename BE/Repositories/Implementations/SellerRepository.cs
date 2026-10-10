using BE.Data;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE.Repositories.Implementations
{
    /// <summary>
    /// Provides data access for seller registration.
    /// </summary>

    public class SellerRepository : ISellerRepository
    {
        private readonly ApplicationDbContext _context;

        public SellerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SellerAccount?> GetByUserIdAsync(string userId)
        {
            return await _context.SellerAccounts
                .Include(x => x.SellerType)
                .Include(x => x.SellerStatus)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<SellerAccount?> GetBySellerIdAsync(string sellerId)
        {
            return await _context.SellerAccounts
                .Include (x => x.SellerType)
                .Include (x => x.SellerStatus)
                .FirstOrDefaultAsync(x => x.SellerId == sellerId);
        }

        public async Task<bool> HasShopAsync(string userId)
        {
            return await _context.Shops.AnyAsync(s => s.OwnerId == userId);
        }

        public async Task AddSellerAsync(SellerAccount seller)
        {
            await _context.SellerAccounts.AddAsync(seller);
        }

        public async Task<SellerType?> GetSellerTypeAsync(int sellerTypeId)
        {
            return await _context.SellerTypes
                .FirstOrDefaultAsync(x => x.SellerTypeId == sellerTypeId);
        }

        public async Task<SellerStatus?> GetSellerStatusByCodeAsync(string code)
        {
            return await _context.SellerStatuses
                .FirstOrDefaultAsync (x => x.Code == code);
        }

        public async Task<SellerAddress?> GetAddressAsync(string sellerId)
        {
            return await _context.SellerAddresses
                .FirstOrDefaultAsync(x => x.SellerId == sellerId);
        }

        public async Task AddAddressAsync(SellerAddress address)
        {
            await _context.SellerAddresses.AddAsync(address);
        }

        public async Task<SellerBank?> GetPrimaryBankAsync(string sellerId)
        {
            return await _context.SellerBanks
                .FirstOrDefaultAsync(x =>
                    x.SellerId == sellerId &&
                    x.IsPrimary);
        }

        public async Task AddBankAsync(SellerBank bank)
        {
            await _context.SellerBanks.AddAsync(bank);
        }

        public async Task<SellerBusiness?> GetBusinessAsync(string sellerId)
        {
            return await _context.SellerBusinesses
                .FirstOrDefaultAsync(x => x.SellerId == sellerId);
        }

        public async Task AddBusinessAsync(SellerBusiness business)
        {
            await _context.SellerBusinesses.AddAsync(business);
        }

        public async Task<SellerDocumentType?> GetDocumentTypeAsync(int documentTypeId)
        {
            return await _context.SellerDocumentTypes
                .FirstOrDefaultAsync(x => x.DocumentTypeId == documentTypeId);
        }

        public async Task<List<SellerDocument>> GetDocumentsAsync(string sellerId)
        {
            return await _context.SellerDocuments
                .Include(x => x.SellerDocumentType)
                .Where(x => x.SellerId == sellerId)
                .ToListAsync();
        }

        public async Task<SellerDocument?> GetDocumentAsync(long documentId)
        {
            return await _context.SellerDocuments
                .FirstOrDefaultAsync(x => x.DocumentId == documentId);
        }

        public async Task AddDocumentAsync(SellerDocument document)
        {
            await _context.SellerDocuments.AddAsync(document);
        }

        public void RemoveDocument(SellerDocument document)
        {
            _context.SellerDocuments.Remove(document);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task ClearRegistrationAsync(string sellerId)
        {
            //clear address
            var addresses = await _context.SellerAddresses
                .Where(x => x.SellerId == sellerId)
                .ToListAsync();

            if(addresses.Any())
            {
                _context.SellerAddresses.RemoveRange(addresses);
            }

            //clear bank
            var banks = await _context.SellerBanks
                .Where(x => x.SellerId == sellerId)
                .ToListAsync();

            if (banks.Any())
            {
                _context.SellerBanks.RemoveRange(banks);
            }

            //clear business info
            var businesses = await _context.SellerBusinesses
                .Where(x => x.SellerId == sellerId)
                .ToListAsync();

            if (businesses.Any())
            {
                _context.SellerBusinesses.RemoveRange(businesses);
            }

            //clear document update
            var documents = await _context.SellerDocuments
                .Where(x => x.SellerId == sellerId) 
                .ToListAsync();

            if (documents.Any())
            {
                _context.SellerDocuments.RemoveRange(documents);
            } 

        }
    }
}
