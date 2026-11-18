using BE.Data;
using BE.Middlewares;
using BE.Models.DTOs.Seller;
using BE.Models.Entities;
using BE.Services.Interface.Seller;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Seller
{
    public class SellerVoucherService : ISellerVoucherService
    {
        private readonly ApplicationDbContext _context;

        public SellerVoucherService(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task<Shop> GetSellerShopAsync(string sellerUserId)
        {
            var shop = await _context.Shops
                .FirstOrDefaultAsync(s => s.OwnerId == sellerUserId);
            if (shop == null)
            {
                throw new AppException("Shop not found for this seller.", 404);
            }
            return shop;
        }

        public async Task<(List<VoucherDto> Items, int Total)> GetVouchersBySellerAsync(
            string sellerUserId, int page, int pageSize, string? search)
        {
            var shop = await GetSellerShopAsync(sellerUserId);

            var query = _context.Vouchers
                .Include(v => v.Category)
                .Include(v => v.Shop)
                .Where(v => v.ShopId == shop.ShopId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(v => v.Code.Contains(search));
            }

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(v => v.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(v => new VoucherDto
                {
                    Id = v.Id,
                    Code = v.Code,
                    DiscountType = v.DiscountType,
                    Value = v.Value,
                    MaxDiscount = v.MaxDiscount,
                    MinOrderValue = v.MinOrderValue,
                    ExpiredAt = v.ExpiredAt,
                    IsActive = v.IsActive,
                    VoucherType = v.VoucherType,
                    CategoryId = v.CategoryId,
                    CategoryName = v.Category != null ? v.Category.Type : null,
                    ShopId = v.ShopId,
                    ShopName = v.Shop != null ? v.Shop.Name : null,
                    UsageLimit = v.UsageLimit,
                    UsageCount = v.UsageCount
                })
                .ToListAsync();

            return (items, total);
        }

        public async Task<VoucherDto> CreateVoucherAsync(string sellerUserId, CreateVoucherRequest request)
        {
            var shop = await GetSellerShopAsync(sellerUserId);

            // Check if code is already used
            var codeExists = await _context.Vouchers
                .AnyAsync(v => v.Code.ToUpper() == request.Code.ToUpper() && v.IsActive);
            if (codeExists)
            {
                throw new AppException($"Voucher code '{request.Code}' is already in use by an active voucher.", 400);
            }

            // Validate Category if VoucherType is Category
            if (request.VoucherType == "Category")
            {
                if (!request.CategoryId.HasValue)
                {
                    throw new AppException("CategoryId is required for Category voucher type.", 400);
                }

                var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == request.CategoryId.Value);
                if (!categoryExists)
                {
                    throw new AppException("Specified category does not exist.", 400);
                }
            }
            else
            {
                // Ensure CategoryId is null for other voucher types
                request.CategoryId = null;
            }

            var voucher = new Voucher
            {
                Code = request.Code.ToUpper().Trim(),
                DiscountType = request.DiscountType,
                Value = request.Value,
                MaxDiscount = request.MaxDiscount,
                MinOrderValue = request.MinOrderValue,
                ExpiredAt = request.ExpiredAt,
                IsActive = true,
                VoucherType = request.VoucherType,
                CategoryId = request.CategoryId,
                ShopId = shop.ShopId,
                UsageLimit = request.UsageLimit,
                UsageCount = 0
            };

            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();

            // Fetch relations for mapping
            await _context.Entry(voucher).Reference(v => v.Shop).LoadAsync();
            if (voucher.CategoryId.HasValue)
            {
                await _context.Entry(voucher).Reference(v => v.Category).LoadAsync();
            }

            return new VoucherDto
            {
                Id = voucher.Id,
                Code = voucher.Code,
                DiscountType = voucher.DiscountType,
                Value = voucher.Value,
                MaxDiscount = voucher.MaxDiscount,
                MinOrderValue = voucher.MinOrderValue,
                ExpiredAt = voucher.ExpiredAt,
                IsActive = voucher.IsActive,
                VoucherType = voucher.VoucherType,
                CategoryId = voucher.CategoryId,
                CategoryName = voucher.Category != null ? voucher.Category.Type : null,
                ShopId = voucher.ShopId,
                ShopName = voucher.Shop != null ? voucher.Shop.Name : null,
                UsageLimit = voucher.UsageLimit,
                UsageCount = voucher.UsageCount
            };
        }

        public async Task<VoucherDto> UpdateVoucherAsync(long voucherId, string sellerUserId, UpdateVoucherRequest request)
        {
            var shop = await GetSellerShopAsync(sellerUserId);

            var voucher = await _context.Vouchers
                .Include(v => v.Category)
                .Include(v => v.Shop)
                .FirstOrDefaultAsync(v => v.Id == voucherId && v.ShopId == shop.ShopId);

            if (voucher == null)
            {
                throw new AppException("Voucher not found or access denied.", 404);
            }

            voucher.DiscountType = request.DiscountType;
            voucher.Value = request.Value;
            voucher.MaxDiscount = request.MaxDiscount;
            voucher.MinOrderValue = request.MinOrderValue;
            voucher.ExpiredAt = request.ExpiredAt;
            voucher.IsActive = request.IsActive;
            voucher.UsageLimit = request.UsageLimit;

            await _context.SaveChangesAsync();

            return new VoucherDto
            {
                Id = voucher.Id,
                Code = voucher.Code,
                DiscountType = voucher.DiscountType,
                Value = voucher.Value,
                MaxDiscount = voucher.MaxDiscount,
                MinOrderValue = voucher.MinOrderValue,
                ExpiredAt = voucher.ExpiredAt,
                IsActive = voucher.IsActive,
                VoucherType = voucher.VoucherType,
                CategoryId = voucher.CategoryId,
                CategoryName = voucher.Category != null ? voucher.Category.Type : null,
                ShopId = voucher.ShopId,
                ShopName = voucher.Shop != null ? voucher.Shop.Name : null,
                UsageLimit = voucher.UsageLimit,
                UsageCount = voucher.UsageCount
            };
        }

        public async Task DeleteVoucherAsync(long voucherId, string sellerUserId)
        {
            var shop = await GetSellerShopAsync(sellerUserId);

            var voucher = await _context.Vouchers
                .FirstOrDefaultAsync(v => v.Id == voucherId && v.ShopId == shop.ShopId);

            if (voucher == null)
            {
                throw new AppException("Voucher not found or access denied.", 404);
            }

            // Check if voucher has been used in orders.
            var hasBeenUsed = await _context.OrderVouchers.AnyAsync(ov => ov.VoucherId == voucherId);
            if (hasBeenUsed)
            {
                // Soft-delete: just deactivate it so history is preserved
                voucher.IsActive = false;
            }
            else
            {
                // Hard-delete: safe to remove completely
                _context.Vouchers.Remove(voucher);
            }

            await _context.SaveChangesAsync();
        }
    }
}
