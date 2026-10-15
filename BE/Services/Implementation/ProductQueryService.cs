using BE.Constants;
using BE.Data;
using BE.Extensions;
using BE.Models.DTOs;
using BE.Models.DTOs.Products;
using BE.Models.DTOs.Products.ProductDetail;
using BE.Models.DTOs.Products.ProductFilter;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Product;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    /// <summary>
    /// Query side of Product (CQRS Read Model)
    /// - Read-only optimized queries
    /// - Filtering / pagination / sorting
    /// - Product detail projection via ProductMappingExtensions
    /// - Filter metadata (faceted search)
    /// </summary>
    public class ProductQueryService : IProductQueryService
    {
        private readonly IProductRepository _productRepository;
        private readonly ApplicationDbContext _context;

        public ProductQueryService(
            IProductRepository productRepository,
            ApplicationDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }

        // ===================== BASIC =====================

        public async Task<ProductListDto?> GetByIdAsync(long id)
        {
            var product = await _productRepository.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return null;

            var stock = product.Variants
                .Sum(v => v.Inventory != null
                    ? (v.Inventory.AvailableStock - v.Inventory.ReservedStock)
                    : 0);

            return new ProductListDto
            {
                Id = product.ProductId,
                Slug = product.Slug,
                Name = product.Name,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                FinalPrice = product.DiscountPrice ?? product.Price,
                AvailableStock = stock,
                Stock = stock,
                ImageUrl = product.Image,
                RatingAvg = product.RatingAvg,
                RatingCount = product.RatingCount,
                CategoryName = product.Category?.Type,
                BrandName = product.Brand?.Name,
                Description = product.Description
            };
        }

        public async Task<(IEnumerable<ProductListDto> items, int total)> FilterAsync(ProductFilterDto filter)
        {
            var query = _productRepository.Query();

            // SEARCH
            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(p => p.Name.Contains(filter.Search));

            // CATEGORY
            if (filter.CategoryIds?.Any() == true)
                query = query.Where(p => filter.CategoryIds.Contains(p.CategoryId));

            // BRAND
            if (filter.BrandIds?.Any() == true)
                query = query.Where(p => filter.BrandIds.Contains(p.BrandId));

            // ATTRIBUTE
            if (filter.AttributeValueIds?.Any() == true)
            {
                var ids = filter.AttributeValueIds;
                query = query.Where(p => p.ProductAttributes.Any(pa => ids.Contains(pa.ValueId)));
            }

            // RATING
            if (filter.MinRating.HasValue)
                query = query.Where(p => p.RatingAvg >= filter.MinRating.Value);

            // PRICE
            if (filter.MinPrice.HasValue)
                query = query.Where(p => (p.DiscountPrice ?? p.Price) >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => (p.DiscountPrice ?? p.Price) <= filter.MaxPrice.Value);

            // PROJECT
            var projected = query.Select(p => new
            {
                Product = p,
                AvailableStock = p.Variants
                    .Sum(v => v.Inventory != null
                        ? v.Inventory.AvailableStock - v.Inventory.ReservedStock
                        : 0),
                FinalPrice = p.Variants.Any()
                    ? p.Variants.Min(v => v.Price ?? p.Price)
                    : (p.DiscountPrice ?? p.Price)
            });

            // SORT
            projected = filter.SortBy switch
            {
                ProductSortConstants.PriceAsc => projected.OrderBy(x => x.FinalPrice),
                ProductSortConstants.PriceDesc => projected.OrderByDescending(x => x.FinalPrice),
                ProductSortConstants.Rating => projected.OrderByDescending(x => x.Product.RatingAvg),
                _ => projected.OrderByDescending(x => x.Product.CreatedAt)
            };

            var page = filter.Page <= 0 ? 1 : filter.Page;
            var pageSize = filter.PageSize <= 0 ? 20 : filter.PageSize;
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
                    ImageUrl = x.Product.Image,
                    RatingAvg = x.Product.RatingAvg,
                    RatingCount = x.Product.RatingCount,
                    CategoryName = x.Product.Category != null ? x.Product.Category.Type : null,
                    BrandName = x.Product.Brand != null ? x.Product.Brand.Name : null,
                    Description = x.Product.Description
                })
                .ToListAsync();

            return (items, total);
        }

        public async Task<ProductFilterMetaDto> GetFilterMetaAsync(ProductFilterDto filter)
        {
            var query = _productRepository.Query();

            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(p => p.Name.Contains(filter.Search));

            if (filter.CategoryIds?.Any() == true)
                query = query.Where(p => filter.CategoryIds.Contains(p.CategoryId));

            if (filter.BrandIds?.Any() == true)
                query = query.Where(p => filter.BrandIds.Contains(p.BrandId));

            if (filter.MinPrice.HasValue)
                query = query.Where(p => (p.DiscountPrice ?? p.Price) >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => (p.DiscountPrice ?? p.Price) <= filter.MaxPrice.Value);

            if (filter.MinRating.HasValue)
                query = query.Where(p => p.RatingAvg >= filter.MinRating.Value);

            var categories = await query
                .GroupBy(p => p.Category)
                .Select(g => new FilterOptionDto
                {
                    Id = g.Key.CategoryId,
                    Name = g.Key.Type,
                    Count = g.Count()
                })
                .ToListAsync();

            var brands = await query
                .GroupBy(p => p.Brand)
                .Select(g => new FilterOptionDto
                {
                    Id = g.Key.BrandId,
                    Name = g.Key.Name,
                    Count = g.Count()
                })
                .ToListAsync();

            var productIds = query.Select(p => p.ProductId);

            var allAttributes = await _context.ProductAttributes
                .Where(pa => productIds.Contains(pa.ProductId))
                .Include(pa => pa.AttributeValue)
                    .ThenInclude(av => av.AttributeType)
                .GroupBy(pa => new
                {
                    pa.ValueId,
                    pa.AttributeValue.Value,
                    AttributeTypeId = pa.AttributeValue.AttributeId,
                    AttributeTypeName = pa.AttributeValue.AttributeType.Name
                })
                .Select(g => new
                {
                    g.Key.AttributeTypeName,
                    Option = new FilterOptionDto
                    {
                        Id = g.Key.ValueId,
                        Name = g.Key.Value,
                        Count = g.Count()
                    }
                })
                .ToListAsync();

            return new ProductFilterMetaDto
            {
                Categories = categories,
                Brands = brands,
                Colors = allAttributes.Where(a => a.AttributeTypeName == ProductAttributeConstants.Color).Select(a => a.Option).ToList(),
                Sizes = allAttributes.Where(a => a.AttributeTypeName == ProductAttributeConstants.Size).Select(a => a.Option).ToList(),
                Materials = allAttributes.Where(a => a.AttributeTypeName == ProductAttributeConstants.Material).Select(a => a.Option).ToList()
            };
        }

        // ===================== DETAIL BY SLUG =====================

        public async Task<ProductDetailDto?> GetProductDetailBySlugAsync(string slug)
        {
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
                .Where(p => p.Slug == slug && (p.Status == ProductConstants.ProductStatusActive || p.Status == ProductConstants.ProductStatusOutOfStock))
                .FirstOrDefaultAsync();

            if (product == null) return null;

            var detail = product.ToDetailDto();

            if (detail.Shop != null)
            {
                var shopStats = await _context.Products
                    .AsNoTracking()
                    .Where(p => p.ShopId == detail.Shop.ShopId)
                    .GroupBy(p => p.ShopId)
                    .Select(g => new
                    {
                        Count = g.Count(),
                        RatingAvg = g.Average(x => x.RatingAvg)
                    })
                    .FirstOrDefaultAsync();

                if (shopStats != null)
                {
                    detail.Shop.ProductCount = shopStats.Count;
                    detail.Shop.Rating = (float)shopStats.RatingAvg;
                }
            }

            return detail;
        }
    }
}
