using System;
using BE.Data;
using BE.Models.DTOs;
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

        public async Task<List<ProductListDto>> GetAllAsync()
        {
            return await _context.Products
                .Select(p => new ProductListDto
                {
                    Id = p.ProductId,
                    Name = p.Name,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Stock = p.Stock,
                    ImageUrl = p.Image,
                    RatingAvg = p.RatingAvg,
                    CategoryName = p.Name,
                    BrandName = p.Name
                })
                .ToListAsync();
        }

        public async Task<ProductListDto?> GetByIdAsync(long id)
        {
            return await (
                from p in _context.Products
                join c in _context.Categories on p.CategoryId equals c.CategoryId
                join b in _context.Brands on p.BrandId equals b.BrandId
                where p.ProductId == id
                select new ProductListDto
                {
                    Id = p.ProductId,
                    Name = p.Name,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Stock = p.Stock,
                    ImageUrl = p.Image,
                    RatingAvg = p.RatingAvg,
                    CategoryName = c.Type,
                    BrandName = b.Name
                }
            ).FirstOrDefaultAsync();
        }

        public async Task<List<ProductListDto>> SearchAsync(string keyword)
        {
            return await (
                from p in _context.Products
                join c in _context.Categories on p.CategoryId equals c.CategoryId
                join b in _context.Brands on p.BrandId equals b.BrandId
                where p.Name.Contains(keyword)
                select new ProductListDto
                {
                    Id = p.ProductId,
                    Name = p.Name,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Stock = p.Stock,
                    ImageUrl = p.Image,
                    RatingAvg = p.RatingAvg,
                    CategoryName = c.Type,
                    BrandName = b.Name
                }
            ).ToListAsync();
        }
    }
}