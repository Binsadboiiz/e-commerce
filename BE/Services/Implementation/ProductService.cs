using BE.Constants;
using BE.Data;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Product;
using BE.Utils;
using Microsoft.EntityFrameworkCore;

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

                var baseSlug = SlugHelper.GenerateSlug(request.Name);
                var slug = await GenerateUniqueSlugAsync(baseSlug);

                var product = new Product
                {
                    Name = request.Name,
                    Slug = slug,
                    Description = request.Description,
                    ShopId = shop.ShopId,
                    CategoryId = request.CategoryId,
                    BrandId = request.BrandId,
                    Status = ProductConstants.ProductStatusActive,
                    Image = request.ImageUrl,
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

            if (!string.IsNullOrWhiteSpace(request.Name)
                && request.Name != product.Name)
            {
                var baseSlug = SlugHelper.GenerateSlug(request.Name);
                product.Slug = await GenerateUniqueSlugAsync(baseSlug);
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.Status = request.Status;
            
            if (request.ImageUrl != null)
            {
                product.Image = request.ImageUrl;
            }

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

        private async Task<string> GenerateUniqueSlugAsync(string baseSlug)
        {
            var slug = baseSlug;
            var index = 1;

            while (await _context.Products.AnyAsync(p => p.Slug == slug))
            {
                slug = $"{baseSlug}-{index}";
                index++;
            }

            return slug;
        }

        /// <summary>
        /// Lấy toàn bộ sản phẩm của retailer (bao gồm deleted).
        /// Hỗ trợ search theo tên, filter theo status, sort theo nhiều tiêu chí, pagination.
        /// </summary>
        public async Task<(IEnumerable<ProductListDto> items, int total)> GetProductsByRetailerAsync(
            string retailerUserId,
            int page,
            int pageSize,
            string? search,
            string? status,
            string? sortBy)
        {
            // Tìm shop của retailer
            var shop = await _context.Shops
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.OwnerId == retailerUserId);

            if (shop == null)
                return (Enumerable.Empty<ProductListDto>(), 0);

            // Query toàn bộ products (bao gồm deleted vì soft delete)
            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Variants)
                .Include(p => p.Images)
                .Where(p => p.ShopId == shop.ShopId);

            // SEARCH theo tên
            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search));

            // FILTER theo status (nếu không truyền thì lấy tất cả)
            if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
                query = query.Where(p => p.Status == status.ToLower());

            // PROJECT — tính SoldCount từ Inventory
            var projected = query.Select(p => new
            {
                Product = p,

                AvailableStock = p.Variants
                    .Sum(v => v.Inventory != null
                        ? v.Inventory.AvailableStock - v.Inventory.ReservedStock : 0),

                SoldCount = _context.Inventories
                    .Where(inv => p.Variants.Select(v => v.VariantId)
                        .Contains(inv.ProductVariantId))
                    .Sum(inv => inv.SoldStock),

                FinalPrice = p.Variants.Any()
                    ? p.Variants.Min(v =>
                        (p.DiscountPrice ?? p.Price) + (v.PriceAdjustment ?? 0))
                    : (p.DiscountPrice ?? p.Price)
            });

            // SORT
            projected = sortBy?.ToLower() switch
            {
                "price_asc" => projected.OrderBy(x => x.FinalPrice),
                "price_desc" => projected.OrderByDescending(x => x.FinalPrice),
                "sold" => projected.OrderByDescending(x => x.SoldCount),
                "stock_asc" => projected.OrderBy(x => x.AvailableStock),
                "stock_desc" => projected.OrderByDescending(x => x.AvailableStock),
                "oldest" => projected.OrderBy(x => x.Product.CreatedAt),
                "name_asc" => projected.OrderBy(x => x.Product.Name),
                "name_desc" => projected.OrderByDescending(x => x.Product.Name),
                _ => projected.OrderByDescending(x => x.Product.CreatedAt) // mặc định: mới nhất
            };

            // Pagination
            page = page <= 0 ? 1 : page;
            pageSize = pageSize <= 0 ? 20 : pageSize;
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
                    ImageUrl = x.Product.Images
                        .Where(i => i.IsPrimary)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? x.Product.Image,
                    RatingAvg = x.Product.RatingAvg,
                    RatingCount = x.Product.RatingCount,
                    CategoryName = x.Product.Category != null ? x.Product.Category.Type : null,
                    BrandName = x.Product.Brand != null ? x.Product.Brand.Name : null,
                    Status = x.Product.Status,
                    CreatedAt = x.Product.CreatedAt,
                    SoldCount = x.SoldCount
                })
                .ToListAsync();

            return (items, total);
        }

    }
}