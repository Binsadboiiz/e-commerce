using System;
using System.Threading.Tasks;
using BE.Data;
using BE.Models.DTOs.Seller;
using BE.Models.Entities;
using BE.Repositories.Interfaces.Seller;
using Microsoft.EntityFrameworkCore;

namespace BE.Repositories.Implementations.Seller
{
    /// <summary>
    /// Repository implementation for store profile data access operations using EF Core.
    /// Handles querying and updating both basic Shop entity info and detailed StoreDetail data.
    /// </summary>
    public class StoreRepository : IStoreRepository
    {
        private readonly ApplicationDbContext _context;

        public StoreRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task<StoreDetailResponse?> GetByShopIdAsync(long shopId)
        {
            var shop = await _context.Shops
                .AsNoTracking()
                .Include(s => s.StoreDetail)
                .FirstOrDefaultAsync(s => s.ShopId == shopId);

            if (shop == null)
            {
                return null;
            }

            return MapToResponse(shop);
        }

        /// <inheritdoc />
        public async Task<StoreDetailResponse?> GetByOwnerIdAsync(string ownerId)
        {
            var shop = await _context.Shops
                .AsNoTracking()
                .Include(s => s.StoreDetail)
                .FirstOrDefaultAsync(s => s.OwnerId == ownerId);

            if (shop == null)
            {
                return null;
            }

            return MapToResponse(shop);
        }

        /// <inheritdoc />
        public async Task<bool> IsOwnerAsync(long shopId, string ownerId)
        {
            return await _context.Shops
                .AsNoTracking()
                .AnyAsync(s => s.ShopId == shopId && s.OwnerId == ownerId);
        }

        /// <inheritdoc />
        public async Task<bool> ExistsAsync(long shopId)
        {
            return await _context.Shops
                .AsNoTracking()
                .AnyAsync(s => s.ShopId == shopId);
        }

        /// <inheritdoc />
        public async Task<bool> UpdateAsync(long shopId, UpdateStoreRequest request)
        {
            var shop = await _context.Shops
                .Include(s => s.StoreDetail)
                .FirstOrDefaultAsync(s => s.ShopId == shopId);

            if (shop == null)
            {
                return false;
            }

            // Update basic Shop properties
            shop.Name = request.Name;
            shop.Description = request.Description ?? shop.Description;
            if (!string.IsNullOrWhiteSpace(request.Logo))
            {
                shop.Logo = request.Logo;
            }
            shop.Update_At = DateTime.UtcNow;

            // Update or create extended StoreDetail
            if (shop.StoreDetail == null)
            {
                shop.StoreDetail = new StoreDetail
                {
                    ShopId = shopId,
                    StoreAddress = request.StoreAddress,
                    StoreCity = request.StoreCity,
                    StoreState = request.StoreState,
                    StoreZipCode = request.StoreZipCode,
                    StorePhone = request.StorePhone,
                    StoreEmail = request.StoreEmail
                };
            }
            else
            {
                shop.StoreDetail.StoreAddress = request.StoreAddress;
                shop.StoreDetail.StoreCity = request.StoreCity;
                shop.StoreDetail.StoreState = request.StoreState;
                shop.StoreDetail.StoreZipCode = request.StoreZipCode;
                shop.StoreDetail.StorePhone = request.StorePhone;
                shop.StoreDetail.StoreEmail = request.StoreEmail;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Maps a Shop entity and its associated StoreDetail into a unified StoreDetailResponse DTO.
        /// </summary>
        private static StoreDetailResponse MapToResponse(Shop shop)
        {
            return new StoreDetailResponse
            {
                ShopId = shop.ShopId,
                Name = shop.Name ?? string.Empty,
                Status = shop.Status ?? string.Empty,
                Description = shop.Description,
                Logo = shop.Logo,
                StoreAddress = shop.StoreDetail?.StoreAddress,
                StoreCity = shop.StoreDetail?.StoreCity,
                StoreState = shop.StoreDetail?.StoreState,
                StoreZipCode = shop.StoreDetail?.StoreZipCode,
                StorePhone = shop.StoreDetail?.StorePhone,
                StoreEmail = shop.StoreDetail?.StoreEmail
            };
        }
    }
}
