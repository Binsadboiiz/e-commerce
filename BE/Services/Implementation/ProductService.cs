using BE.Constants;
using BE.Data;
using BE.Repositories.Interfaces;
using BE.Models.DTOs;
using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;
using BE.Services.Interface.Product;

namespace BE.Services.Implementation
{
    /// <summary>
    /// Handles product write operations (command side),
    /// including create, update and soft delete.
    ///
    /// Responsibilities:
    /// - Manage product lifecycle mutations
    /// - Create variants and initialize inventory
    /// - Enforce retailer ownership checks
    /// - Coordinate transactional consistency
    ///
    /// </summary>
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;


        private readonly ApplicationDbContext _context;

        public ProductService(IProductRepository productRepository, ApplicationDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }

        /// <summary>
        /// Creates a new product with variants and initializes inventory
        /// in a single database transaction.
        ///
        /// Includes:
        /// - Product creation
        /// - Variant creation
        /// - Inventory bootstrap
        ///
        /// Rolls back all changes if any step fails.
        /// </summary>
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

        /// <summary>
        /// Updates mutable product information
        /// after validating retailer ownership.
        ///
        /// </summary>
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

        /// <summary>
        /// Soft deletes a product by marking status as deleted,
        /// preserving historical order/cart references.
        ///
        /// Only product owner can perform this action.
        /// </summary>
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

    }
}