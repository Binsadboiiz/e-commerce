using System;
using System.Linq;
using System.Threading.Tasks;
using BE.Constants;
using BE.Data;
using BE.Middlewares;
using BE.Models.Entities;
using BE.Models.DTOs.Seller;
using BE.Repositories.Interfaces.Seller;
using BE.Services.Interface.Seller;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Seller
{
    /// <summary>
    /// Service implementation for managing seller store profiles and first-time shop setup.
    /// </summary>
    public class StoreService : IStoreService
    {
        private readonly IStoreRepository _storeRepository;
        private readonly ISellerRepository _sellerRepository;
        private readonly ApplicationDbContext _context;

        public StoreService(
            IStoreRepository storeRepository,
            ISellerRepository sellerRepository,
            ApplicationDbContext context)
        {
            _storeRepository = storeRepository;
            _sellerRepository = sellerRepository;
            _context = context;
        }

        /// <inheritdoc />
        public async Task<StoreDetailResponse> GetMyStoreProfileAsync(string userId)
        {
            var store = await _storeRepository.GetByOwnerIdAsync(userId);

            if (store == null)
            {
                throw new AppException("Store not found for the current seller.", 404);
            }

            return store;
        }

        /// <inheritdoc />
        public async Task<StoreDetailResponse> UpdateMyStoreProfileAsync(string userId, UpdateStoreRequest request)
        {
            var store = await _storeRepository.GetByOwnerIdAsync(userId);

            if (store == null)
            {
                throw new AppException("Store not found for the current seller.", 404);
            }

            var updated = await _storeRepository.UpdateAsync(store.ShopId, request);

            if (!updated)
            {
                throw new AppException("Failed to update store profile.", 500);
            }

            var updatedStore = await _storeRepository.GetByOwnerIdAsync(userId);
            return updatedStore ?? store;
        }

        /// <summary>
        /// Retrieves the seller's shop status. If a shop exists, returns HasShop = true.
        /// If not, retrieves suggested auto-filled values from the seller's approved registration profile.
        /// </summary>
        public async Task<SellerShopStatusDto> GetShopStatusAsync(string userId)
        {
            // Step 1: Check if shop record already exists
            var shop = await _context.Shops
                .FirstOrDefaultAsync(s => s.OwnerId == userId);

            if (shop != null)
            {
                return new SellerShopStatusDto
                {
                    HasShop = true,
                    ShopId = shop.ShopId,
                    ShopName = shop.Name
                };
            }

            var seller = await _context.SellerAccounts
                .Include(s => s.SellerStatus)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            var address = seller != null ? await _sellerRepository.GetAddressAsync(seller.SellerId) : null;
            var business = seller != null ? await _sellerRepository.GetBusinessAsync(seller.SellerId) : null;

            string suggestedName = !string.IsNullOrWhiteSpace(business?.CompanyName)
                ? business.CompanyName
                : seller?.User?.FullName ?? string.Empty;

            return new SellerShopStatusDto
            {
                HasShop = false,
                SuggestedName = suggestedName,
                SuggestedPhone = address?.PhoneNumber ?? seller?.User?.Phone ?? "",
                SuggestedCity = address?.City ?? "",
                SuggestedDistrict = address?.District ?? "",
                SuggestedWard = address?.Ward ?? "",
                SuggestedStreetAddress = address?.StreetAddress ?? "",
                SellerStatusCode = seller?.SellerStatus?.Code ?? ""
            };
        }

        /// <summary>
        /// Performs initial first-time shop setup for an approved seller.
        /// Creates a new Shop record and sets initial status to ACTIVE.
        /// </summary>
        public async Task<StoreDetailResponse> SetupShopAsync(string userId, SetupShopRequest request)
        {
            // Step 1: Prevent duplicate shop creation for single owner
            var existingShop = await _context.Shops
                .FirstOrDefaultAsync(s => s.OwnerId == userId);

            if (existingShop != null)
            {
                throw new AppException("Seller already has an active shop.", 400);
            }

            var shop = new Shop
            {
                OwnerId = userId,
                Name = request.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(request.Description) ? "Official Store on PolarisX Mall" : request.Description.Trim(),
                Status = ShopStatus.Active,
                IsActive = true,
                Logo = request.Logo,
                Create_At = DateTime.UtcNow,
                Update_At = DateTime.UtcNow
            };

            _context.Shops.Add(shop);
            await _context.SaveChangesAsync();

            // Try saving optional extended StoreDetail safely
            try
            {
                var fullAddress = string.Join(", ", new[] { request.StreetAddress, request.Ward, request.District }.Where(s => !string.IsNullOrWhiteSpace(s)));
                var storeDetail = new StoreDetail
                {
                    ShopId = shop.ShopId,
                    StorePhone = request.Phone ?? "",
                    StoreCity = request.City ?? "",
                    StoreAddress = fullAddress
                };
                _context.StoreDetails.Add(storeDetail);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Safely catch if StoreDetails table does not exist in physical database
                Console.WriteLine($"[StoreService] Notice: Skipping StoreDetail save as table does not exist: {ex.Message}");
            }

            return new StoreDetailResponse
            {
                ShopId = shop.ShopId,
                Name = shop.Name,
                Description = shop.Description,
                Logo = shop.Logo,
                Status = shop.Status
            };
        }

        /// <inheritdoc />
        public async Task<SellerAddressDto?> GetSellerAddressAsync(string userId)
        {
            var seller = await _context.SellerAccounts
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (seller == null)
            {
                throw new AppException("The seller account does not exist.", 404);
            }

            var address = await _sellerRepository.GetAddressAsync(seller.SellerId);
            if (address == null)
            {
                return new SellerAddressDto
                {
                    FullName = seller.User?.FullName ?? "",
                    PhoneNumber = seller.User?.Phone ?? "",
                    City = "",
                    District = "",
                    Ward = "",
                    StreetAddress = "",
                    PostalCode = "",
                    IsDefault = true
                };
            }

            return new SellerAddressDto
            {
                FullName = address.FullName,
                PhoneNumber = address.PhoneNumber,
                City = address.City,
                District = address.District,
                Ward = address.Ward,
                StreetAddress = address.StreetAddress,
                PostalCode = address.PostalCode,
                IsDefault = address.IsDefault
            };
        }

        /// <inheritdoc />
        public async Task<SellerAddressDto> UpdateSellerAddressAsync(string userId, SellerAddressDto request)
        {
            var seller = await _context.SellerAccounts
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (seller == null)
            {
                throw new AppException("The seller account does not exist.", 404);
            }

            var address = await _sellerRepository.GetAddressAsync(seller.SellerId);
            if (address == null)
            {
                address = new SellerAddress
                {
                    SellerId = seller.SellerId,
                    FullName = request.FullName?.Trim() ?? "",
                    PhoneNumber = request.PhoneNumber?.Trim() ?? "",
                    City = request.City?.Trim(),
                    District = request.District?.Trim(),
                    Ward = request.Ward?.Trim(),
                    StreetAddress = request.StreetAddress?.Trim(),
                    PostalCode = request.PostalCode?.Trim(),
                    IsDefault = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _sellerRepository.AddAddressAsync(address);
            }
            else
            {
                address.FullName = request.FullName?.Trim() ?? address.FullName;
                address.PhoneNumber = request.PhoneNumber?.Trim() ?? address.PhoneNumber;
                address.City = request.City?.Trim();
                address.District = request.District?.Trim();
                address.Ward = request.Ward?.Trim();
                address.StreetAddress = request.StreetAddress?.Trim();
                address.PostalCode = request.PostalCode?.Trim();
                address.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // Đồng bộ sang StoreDetail nếu có shop
            try
            {
                var shop = await _context.Shops.FirstOrDefaultAsync(s => s.OwnerId == userId);
                if (shop != null)
                {
                    var storeDetail = await _context.StoreDetails.FirstOrDefaultAsync(sd => sd.ShopId == shop.ShopId);
                    var fullAddress = string.Join(", ", new[] { address.StreetAddress, address.Ward, address.District }.Where(s => !string.IsNullOrWhiteSpace(s)));
                    if (storeDetail != null)
                    {
                        storeDetail.StorePhone = address.PhoneNumber;
                        storeDetail.StoreCity = address.City ?? "";
                        storeDetail.StoreAddress = fullAddress;
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[StoreService] Notice: Could not sync address to StoreDetails: {ex.Message}");
            }

            return new SellerAddressDto
            {
                FullName = address.FullName,
                PhoneNumber = address.PhoneNumber,
                City = address.City,
                District = address.District,
                Ward = address.Ward,
                StreetAddress = address.StreetAddress,
                PostalCode = address.PostalCode,
                IsDefault = address.IsDefault
            };
        }
    }
}
