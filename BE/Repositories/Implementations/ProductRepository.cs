using BE.Data;
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

        public IQueryable<Product> Query()
        {
            return _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductAttributes)
                .Include(p => p.Variants)
                .Include(p => p.Images)
                .AsNoTracking()
                .Where(p => p.Status == "active");
        }

        public async Task<Product?> GetByIdAsync(long id)
        {
            return await Query()
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public async Task<Product?> GetBySlugAsync(string slug)
        {
            return await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == slug);
        }
    }
}