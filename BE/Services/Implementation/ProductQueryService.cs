using BE.Data;
using BE.Models.DTOs;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Product;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    /// <summary>
    /// Handles product read/query operations (query side).
    ///
    /// Responsibilities:
    /// - Product listing queries
    /// - Filtering and pagination
    /// - Product detail projections
    /// - Filter metadata aggregation
    ///
    /// READ-ONLY service.
    /// </summary>
    
    public class ProductQueryService : IProductQueryService
    {
        private readonly IProductRepository _productRepository;
        private readonly ApplicationDbContext _context;

        public ProductQueryService (IProductRepository productRepository, ApplicationDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }

        /// <summary>
        /// Retrieves a single product projection
        /// optimized for read scenarios.
        ///
        /// Returns product list/detail DTO model
        /// </summary>
        
        public async Task<ProductListDto?> GetByIdAsync(long id)
        {
            var product = await _productRepository.Query()
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return null;

            return new ProductListDto
            {
                Id = product.ProductId,
                Name = product.Name,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                FinalPrice = product.DiscountPrice ?? product.Price,
                Stock = product.Stock,
                ImageUrl = product.Image,
                RatingAvg = product.RatingAvg,
                RatingCount = product.RatingCount,
                CategoryName = product.Category?.Type,
                BrandName = product.Brand?.Name
            };
        }

        /// <summary>
        /// Applies dynamic product filtering,
        /// sorting and pagination.
        ///
        /// Supports:
        /// - Search
        /// - Category/brand filtering
        /// - Attribute filtering
        /// - Price/rating filtering
        /// - Sorted paged results
        /// </summary>
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

                query = query.Where(p =>
                    p.ProductAttributes.Any(pa => ids.Contains(pa.ValueId))
                );
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
                FinalPrice = p.Variants.Any()
                    ? p.Variants.Min(v =>
                        (p.DiscountPrice ?? p.Price) + (v.PriceAdjustment ?? 0))
                    : (p.DiscountPrice ?? p.Price)
            });

            // SORT
            projected = filter.SortBy switch
            {
                "price_asc" => projected.OrderBy(x => x.FinalPrice),
                "price_desc" => projected.OrderByDescending(x => x.FinalPrice),
                "rating" => projected.OrderByDescending(x => x.Product.RatingAvg),
                _ => projected.OrderByDescending(x => x.Product.CreatedAt)
            };

            var page = filter.Page <= 0 ? 1 : filter.Page;
            var pageSize = filter.PageSize <= 0 ? 20 : filter.PageSize;
            pageSize = Math.Min(pageSize, 100);

            var skip = (page - 1) * pageSize;

            var total = await projected.CountAsync();

            var items = await projected
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)

                .Select(x => new ProductListDto
                {
                    Id = x.Product.ProductId,
                    Name = x.Product.Name,
                    Price = x.Product.Price,
                    DiscountPrice = x.Product.DiscountPrice,
                    FinalPrice = x.FinalPrice,
                    Stock = x.Product.Stock,
                    ImageUrl = x.Product.Image,
                    RatingAvg = x.Product.RatingAvg,
                    RatingCount = x.Product.RatingCount,
                    CategoryName = x.Product.Category!.Type,
                    BrandName = x.Product.Brand!.Name
                })
                .ToListAsync();

            return (items, total);
        }

        /// <summary>
        /// Returns aggregated filter metadata for frontend faceted search,
        /// including current filter options and future extensible facets.
        /// </summary>
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
                Colors = allAttributes.Where(a => a.AttributeTypeName == "Color").Select(a => a.Option).ToList(),
                Sizes = allAttributes.Where(a => a.AttributeTypeName == "Size").Select(a => a.Option).ToList(),
                Materials = allAttributes.Where(a => a.AttributeTypeName == "Material").Select(a => a.Option).ToList()
            };
        }
    }
}
