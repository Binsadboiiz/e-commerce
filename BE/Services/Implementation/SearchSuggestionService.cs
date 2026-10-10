using BE.Data;
using BE.Models.DTOs.Search;
using BE.Services.Interface.Product;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation
{
    public class SearchSuggestionService : ISearchSuggestionService
    {
        private readonly ApplicationDbContext _context;

        public SearchSuggestionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SearchSuggestionDto> GetSearchSuggestionAsync(string query, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new SearchSuggestionDto();

            var trimmedQuery = query.Trim();
            var lowerQuery = trimmedQuery.ToLower();

            // 1. Categories match (top 4)
            var categories = await _context.Categories
                .AsNoTracking()
                .Where(c => c.Type.ToLower().Contains(lowerQuery))
                .Take(4)
                .Select(c => new CategorySuggestionDto
                {
                    Id = c.CategoryId,
                    Name = c.Type,
                    ProductCount = c.Products.Count(p => p.Status == BE.Constants.ProductConstants.ProductStatusActive)
                })
                .ToListAsync(cancellationToken);

            // 2. Brands match (top 4)
            var brands = await _context.Brands
                .AsNoTracking()
                .Where(b => b.Name.ToLower().Contains(lowerQuery))
                .Take(4)
                .Select(b => new BrandSuggestionDto
                {
                    Id = b.BrandId,
                    Name = b.Name,
                    ProductCount = b.Products.Count(p => p.Status == BE.Constants.ProductConstants.ProductStatusActive)
                })
                .ToListAsync(cancellationToken);

            // 3. Products match (top 5 active products)
            var products = await _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Where(p => p.Status == BE.Constants.ProductConstants.ProductStatusActive &&
                           (p.Name.ToLower().Contains(lowerQuery) || 
                            (p.Description != null && p.Description.ToLower().Contains(lowerQuery))))
                .OrderByDescending(p => p.RatingAvg)
                .ThenByDescending(p => p.CreatedAt)
                .Take(5)
                .Select(p => new ProductSuggestionDto
                {
                    Id = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    FinalPrice = p.DiscountPrice ?? p.Price,
                    ImageUrl = p.Image,
                    RatingAvg = p.RatingAvg,
                    CategoryName = p.Category != null ? p.Category.Type : null,
                    BrandName = p.Brand != null ? p.Brand.Name : null
                })
                .ToListAsync(cancellationToken);

            // 4. Keyword suggestions: based on matching product names
            var keywords = products
                .Select(p => p.Name)
                .Distinct()
                .Take(5)
                .ToList();

            return new SearchSuggestionDto
            {
                Categories = categories,
                Brands = brands,
                Products = products,
                Keywords = keywords
            };
        }
    }
}