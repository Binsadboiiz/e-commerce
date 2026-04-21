using System;
using BE.Data;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(long id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public async Task<List<Product>> SearchAsync(string keyword)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Where(p => p.Name.Contains(keyword))
                .ToListAsync();
        }

        public async Task<(List<Product> items, int total)> FilterAsync(ProductFilterDto filter)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductAttributes)
                .AsNoTracking()
                .Where(p => p.Status == "active");

            // SEARCH
            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(p => p.Name.Contains(filter.Search));
            }

            // CATEGORY
            if (filter.CategoryIds?.Any() == true)
            {
                query = query.Where(p => filter.CategoryIds.Contains(p.CategoryId));
            }

            // BRAND
            if (filter.BrandIds?.Any() == true)
            {
                query = query.Where(p => filter.BrandIds.Contains(p.BrandId));
            }

            // PRICE
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(p => (p.DiscountPrice ?? p.Price) >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(p => (p.DiscountPrice ?? p.Price) <= filter.MaxPrice.Value);
            }

            // ATTRIBUTE 
            if (filter.AttributeValueIds?.Any() == true)
            {
                var attrIds = filter.AttributeValueIds;

                query = query.Where(p =>
                    p.ProductAttributes
                        .Select(pa => pa.ValueId)
                        .Distinct()
                        .Count(v => attrIds.Contains(v)) == attrIds.Count
                );
            }

            // SORT
            query = filter.SortBy switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "rating" => query.OrderByDescending(p => p.RatingAvg),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var total = await query.CountAsync();

            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return (items, total);
        }
    }
}