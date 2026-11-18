using BE.Constants;
using BE.Data;
using BE.Extensions;
using BE.Models.DTOs;
using BE.Models.DTOs.Products;
using BE.Models.DTOs.Products.ProductDetail;
using BE.Services.Interface.Product;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Products
{
    public class SellerProductService : ISellerProductService
    {
        private readonly ApplicationDbContext _context;

        public SellerProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductDetailDto?> GetSellerProductByIdAsync(long productId, string sellerUserId)
        {
            var shop = await _context.Shops.AsNoTracking().FirstOrDefaultAsync(s => s.OwnerId == sellerUserId);
            if (shop == null) return null;

            var product = await _context.Products
                .AsNoTracking()
                .Include(p => p.Shop)
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Inventory)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.VariantAttributes)
                        .ThenInclude(va => va.AttributeValue)
                            .ThenInclude(av => av.AttributeType)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Images)
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.ShopId == shop.ShopId);

            if (product == null) return null;

            return product.ToDetailDto();
        }

        public async Task DeleteProductAsync(long productId, string sellerUserId)
        {
            var product = await _context.Products
                .Include(x => x.Shop)
                .FirstOrDefaultAsync(x => x.ProductId == productId);

            if (product == null)
                throw new Exception("Product not found");

            if (product.Shop.OwnerId != sellerUserId)
                throw new UnauthorizedAccessException();

            product.Status = ProductConstants.ProductStatusDeleted;
            await _context.SaveChangesAsync();
        }

        public async Task<(IEnumerable<ProductListDto> items, int total)> GetProductsBySellerAsync(
            string sellerUserId,
            int page,
            int pageSize,
            string? search,
            string? status,
            string? sortBy)
        {
            var shop = await _context.Shops
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.OwnerId == sellerUserId);

            if (shop == null)
                return (Enumerable.Empty<ProductListDto>(), 0);

            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Inventory)
                .Include(p => p.Images)
                .Where(p => p.ShopId == shop.ShopId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search));

            if (!string.IsNullOrWhiteSpace(status) && status != "all")
                query = query.Where(p => p.Status == status);

            var projected = query.Select(p => new
            {
                Product = p,
                AvailableStock = p.Variants
                    .Sum(v => v.Inventory != null
                        ? v.Inventory.AvailableStock - v.Inventory.ReservedStock
                        : 0),
                SoldCount = p.Variants
                    .Sum(v => v.Inventory != null ? v.Inventory.SoldStock : 0),
                FinalPrice = p.Variants.Any()
                    ? p.Variants.Min(v => (p.DiscountPrice ?? p.Price) + (v.Price ?? 0))
                    : (p.DiscountPrice ?? p.Price)
            });

            // Sort with ProductSortConstants
            projected = sortBy?.ToLower() switch
            {
                ProductSortConstants.PriceAsc => projected.OrderBy(x => x.FinalPrice),
                ProductSortConstants.PriceDesc => projected.OrderByDescending(x => x.FinalPrice),
                ProductSortConstants.Sold => projected.OrderByDescending(x => x.SoldCount),
                ProductSortConstants.StockAsc => projected.OrderBy(x => x.AvailableStock),
                ProductSortConstants.StockDesc => projected.OrderByDescending(x => x.AvailableStock),
                ProductSortConstants.Oldest => projected.OrderBy(x => x.Product.CreatedAt),
                ProductSortConstants.NameAsc => projected.OrderBy(x => x.Product.Name),
                ProductSortConstants.NameDesc => projected.OrderByDescending(x => x.Product.Name),
                _ => projected.OrderByDescending(x => x.Product.CreatedAt)
            };

            page = page <= 0 ? 1 : page;
            pageSize = pageSize <= 0 ? 20 : pageSize;
            pageSize = Math.Min(pageSize, 100);

            var total = await projected.CountAsync();

            var items = await projected
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductListDto
                {
                    Id = x.Product.ProductId,
                    Name = x.Product.Name,
                    Slug = x.Product.Slug,
                    Price = x.Product.Price,
                    DiscountPrice = x.Product.DiscountPrice,
                    FinalPrice = x.FinalPrice,
                    AvailableStock = x.AvailableStock,
                    Stock = x.AvailableStock,
                    ImageUrl = x.Product.Images
                        .Where(i => i.IsPrimary)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? x.Product.Image,
                    ImageUrls = x.Product.Images.Any()
                        ? x.Product.Images
                            .OrderByDescending(i => i.IsPrimary)
                            .ThenBy(i => i.SortOrder)
                            .Select(i => i.ImageUrl)
                            .ToList()
                        : (!string.IsNullOrEmpty(x.Product.Image) ? new List<string> { x.Product.Image } : new List<string>()),
                    RatingAvg = x.Product.RatingAvg,
                    RatingCount = x.Product.RatingCount,
                    CategoryId = x.Product.CategoryId,
                    BrandId = x.Product.BrandId,
                    CategoryName = x.Product.Category != null ? x.Product.Category.Type : null,
                    BrandName = x.Product.Brand != null ? x.Product.Brand.Name : null,
                    Status = x.Product.Status,
                    CreatedAt = x.Product.CreatedAt,
                    SoldCount = x.SoldCount,
                    Description = x.Product.Description
                })
                .ToListAsync();

            return (items, total);
        }
    }
}
