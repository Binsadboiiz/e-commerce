using BE.Constants;
using BE.Data;
using BE.Repositories.Interfaces;
using BE.Services.Interface;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Data;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;


        private readonly ApplicationDbContext _context;

        public ProductService(IProductRepository productRepository, ApplicationDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
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

        public async Task<ProductResponse> CreateProductAsync(
            string retailerUserId,
            CreateProductRequest request)
        {
            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                var shop = await _context.Shops
                    .FirstOrDefaultAsync(x => x.OwnerId == retailerUserId);
                if (shop == null)
                    throw new Exception("Shop not found");

                var product = new Product
                {
                    Name = request.Name,
                    Description = request.Description,
                    ShopId = shop.ShopId,
                    CategoryId = request.CategoryId,
                    BrandId = request.BrandId,
                    Status = ProductConstants.ProductStatusActive,
                    CreatedAt = DateTime.UtcNow,
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                foreach (var variantRequest in request.Variants)
                {
                    var variant = new ProductVariant
                    {
                        ProductId = product.ProductId,
                        PriceAdjustment = variantRequest.Price,
                    };

                    _context.ProductVariants.Add(variant);
                    await _context.SaveChangesAsync();

                    var inventory = new Inventory
                    {
                        ProductVariantId = variant.VariantId,
                        AvailableStock = variantRequest.InitialStock,
                        ReservedStock = 0,
                        SoldStock = 0,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Inventories.Add(inventory);
                }

                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                return new ProductResponse
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Status = product.Status,
                };
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        public async Task<ProductResponse> UpdateProductAsync(
            long productId,
            string retailerUserId,
            UpdateProductRequest request)
        {
            var product = await _context.Products
                .Include(x => x.Shop)
                .FirstOrDefaultAsync(x => x.ProductId == productId);

            if (product == null)
                throw new Exception("Product not found");

            if (product.Shop.OwnerId != retailerUserId)
                throw new UnauthorizedAccessException();

            product.Name = request.Name;
            product.Description = request.Description;
            product.Status = request.Status;

            await _context.SaveChangesAsync();
            return new ProductResponse
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Status = product.Status,
            };
        }

        public async Task DeleteProductAsync(
            long productId,
            string retailerUserId)
        {
            var product = await _context.Products
                .Include(x => x.Shop)
                .FirstOrDefaultAsync(x => x.ProductId == productId);
            if (product == null)
                throw new Exception("Product not found");

            if (product.Shop.OwnerId != retailerUserId)
                throw new UnauthorizedAccessException();

            // Soft delete
            product.Status = ProductConstants.ProductStatusDeleted;

            await _context.SaveChangesAsync();
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