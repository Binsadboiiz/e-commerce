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

        public async Task<IEnumerable<ProductListDto>> GetAllAsync()
        {
            var products = await _productRepository.GetAllAsync();

            return products.Select(MapToDto);
        }

        public async Task<ProductListDto?> GetByIdAsync(long id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null) return null;

            return MapToDto(product);
        }

        public async Task<IEnumerable<ProductListDto>> SearchAsync(string keyword)
        {
            var products = await _productRepository.SearchAsync(keyword);

            return products.Select(MapToDto);
        }

        private ProductListDto MapToDto(Product p)
        {
            return new ProductListDto
            {
                Id = p.ProductId,
                Name = p.Name,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                Stock = p.Stock,
                ImageUrl = p.Image,
                RatingAvg = p.RatingAvg,
                CategoryName = p.Category?.Type,
                BrandName = p.Brand?.Name
            };
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
                if(shop == null)
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
                    ProductId =  product.ProductId,
                    Name = product.Name,
                    Status = product.Status,
                };
            }
            catch(Exception ex)
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
            
            if(product == null)
                throw new Exception("Product not found");

            if (product.Shop.OwnerId != retailerUserId)
                throw new UnauthorizedAccessException();
            
            product.Name = request.Name;
            product.Description = request.Description;
            product.Status = request.Status;
            
            await  _context.SaveChangesAsync();
            return new ProductResponse
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Status =  product.Status,
            };
        }

        public async Task DeleteProductAsync(
            long productId, 
            string retailerUserId)
        {
            var product = await _context.Products
                .Include(x => x.Shop)
                .FirstOrDefaultAsync(x => x.ProductId == productId);
            if(product == null)
                throw new Exception("Product not found");

            if(product.Shop.OwnerId != retailerUserId)
                throw new UnauthorizedAccessException();

            // Soft delete
            product.Status = ProductConstants.ProductStatusDeleted;

            await _context.SaveChangesAsync();
        }
    }
}