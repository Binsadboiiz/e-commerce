using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
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
                var attrIds = filter.AttributeValueIds;

                query = query.Where(p =>
                    p.ProductAttributes
                        .Select(a => a.ValueId)
                        .Distinct()
                        .Count(v => attrIds.Contains(v)) == attrIds.Count
                );
            }

            // RATING
            if (filter.MinRating.HasValue)
                query = query.Where(p => p.RatingAvg >= filter.MinRating.Value);

            // PRICE BASE FILTER 
            if (filter.MinPrice.HasValue)
                query = query.Where(p => (p.DiscountPrice ?? p.Price) >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => (p.DiscountPrice ?? p.Price) <= filter.MaxPrice.Value);

            // FINAL PRICE 
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

            // TOTAL
            var total = await projected.CountAsync();

            // PAGING
            var items = await projected
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => x.Product)
                .ToListAsync();

            // MAP DTO
            var result = items.Select(p => new ProductListDto
            {
                Id = p.ProductId,
                Name = p.Name,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                FinalPrice = p.DiscountPrice ?? p.Price,
                Stock = p.Stock,
                ImageUrl = p.Image,
                RatingAvg = p.RatingAvg,
                RatingCount = p.RatingCount,
                CategoryName = p.Category?.Type,
                BrandName = p.Brand?.Name
            });

            return (result, total);
        }

        
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
    }
}