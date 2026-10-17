using BE.Constants;
using BE.Data;
using BE.Extensions;
using BE.Helpers;
using BE.Middlewares;
using BE.Models.DTOs;
using BE.Models.DTOs.Products;
using BE.Models.DTOs.Products.ProductDetail;
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
    /// - Create and synchronize variants and inventories
    /// - Enforce seller ownership checks
    /// - Coordinate transactional consistency
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
        /// Creates a new product with variants and initializes inventory in a single transaction.
        /// </summary>
        public async Task<ProductResponse> CreateProductAsync(
            string sellerUserId,
            CreateProductRequest request)
        {
            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                var shop = await _context.Shops
                    .FirstOrDefaultAsync(x => x.OwnerId == sellerUserId);
                if (shop == null)
                    throw new Exception("Shop not found");

                var slug = await SlugHelper.GenerateUniqueSlugAsync(_context.Products, request.Name);

                var imageList = request.ImageUrls?.Where(url => !string.IsNullOrWhiteSpace(url)).ToList() ?? new List<string>();
                if (!imageList.Any() && !string.IsNullOrWhiteSpace(request.ImageUrl))
                {
                    imageList.Add(request.ImageUrl);
                }

                var primaryImage = imageList.FirstOrDefault() ?? request.ImageUrl;

                var basePrice = request.Price > 0
                    ? request.Price
                    : (request.Variants.Any() ? request.Variants.Min(v => v.Price) : 0);

                var initialStatus = !string.IsNullOrWhiteSpace(request.Status)
                    ? request.Status
                    : ProductConstants.ProductStatusActive;

                var product = new Product
                {
                    Name = request.Name,
                    Slug = slug,
                    Description = request.Description,
                    ShopId = shop.ShopId,
                    RetailerId = sellerUserId,
                    CategoryId = request.CategoryId,
                    BrandId = request.BrandId,
                    Price = basePrice,
                    DiscountPrice = request.DiscountPrice,
                    Status = initialStatus,
                    Image = primaryImage,
                    CreatedAt = DateTime.UtcNow,
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Lưu ảnh Primary Image (IsPrimary = true, VariantId = null)
                int sortOrder = 0;
                var createdImages = new List<ProductImage>();

                if (!string.IsNullOrWhiteSpace(primaryImage))
                {
                    var primaryPImg = new ProductImage
                    {
                        ProductId = product.ProductId,
                        ImageUrl = primaryImage,
                        IsPrimary = true,
                        SortOrder = sortOrder++,
                        CreatedAt = DateTime.UtcNow,
                        VariantId = null
                    };
                    _context.ProductImages.Add(primaryPImg);
                    createdImages.Add(primaryPImg);
                }

                // Lưu các ảnh phụ (IsPrimary = false)
                var nonPrimaryUrls = imageList
                    .Where(url => !string.Equals(url, primaryImage, StringComparison.OrdinalIgnoreCase))
                    .Distinct()
                    .ToList();

                var nonPrimaryImages = new List<ProductImage>();
                foreach (var nonPrimaryUrl in nonPrimaryUrls)
                {
                    var pImg = new ProductImage
                    {
                        ProductId = product.ProductId,
                        ImageUrl = nonPrimaryUrl,
                        IsPrimary = false,
                        SortOrder = sortOrder++,
                        CreatedAt = DateTime.UtcNow,
                        VariantId = null
                    };
                    _context.ProductImages.Add(pImg);
                    nonPrimaryImages.Add(pImg);
                    createdImages.Add(pImg);
                }
                await _context.SaveChangesAsync();

                int totalStock = 0;
                int nonPrimaryImgIndex = 0;

                if (request.Variants != null && request.Variants.Any())
                {
                    for (int i = 0; i < request.Variants.Count; i++)
                    {
                        var variantRequest = request.Variants[i];
                        if (variantRequest.InitialStock < 0)
                            throw new Exception("Initial stock must be >= 0.");

                        var sku = !string.IsNullOrWhiteSpace(variantRequest.Sku)
                            ? variantRequest.Sku.Trim()
                            : $"{slug.ToUpper()}-{i + 1}";

                        var variant = new ProductVariant
                        {
                            ProductId = product.ProductId,
                            Price = variantRequest.Price,
                            Stock = variantRequest.InitialStock,
                            SKU = sku
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

                        totalStock += variantRequest.InitialStock;

                        // Đồng bộ VariantAttributes & ProductAttributes qua Helper
                        await ProductAttributeHelper.ProcessVariantAttributesAsync(
                            _context,
                            product.ProductId,
                            variant.VariantId,
                            variantRequest,
                            request.Variants.Count);

                        // Liên kết ảnh cho Variant
                        if (!string.IsNullOrWhiteSpace(variantRequest.ImageUrl))
                        {
                            var targetUrl = variantRequest.ImageUrl.Trim();
                            var availableImg = createdImages.FirstOrDefault(img =>
                                string.Equals(img.ImageUrl, targetUrl, StringComparison.OrdinalIgnoreCase) &&
                                img.VariantId == null &&
                                !img.IsPrimary);

                            if (availableImg != null)
                            {
                                availableImg.VariantId = variant.VariantId;
                            }
                            else
                            {
                                var variantImg = new ProductImage
                                {
                                    ProductId = product.ProductId,
                                    ImageUrl = targetUrl,
                                    IsPrimary = false,
                                    SortOrder = sortOrder++,
                                    CreatedAt = DateTime.UtcNow,
                                    VariantId = variant.VariantId
                                };
                                _context.ProductImages.Add(variantImg);
                                createdImages.Add(variantImg);
                            }
                        }
                    }
                }
                else
                {
                    var defaultVariant = new ProductVariant
                    {
                        ProductId = product.ProductId,
                        Price = basePrice,
                        Stock = 0,
                        SKU = $"{slug.ToUpper()}-STD"
                    };
                    _context.ProductVariants.Add(defaultVariant);
                    await _context.SaveChangesAsync();

                    _context.Inventories.Add(new Inventory
                    {
                        ProductVariantId = defaultVariant.VariantId,
                        AvailableStock = 0,
                        ReservedStock = 0,
                        SoldStock = 0,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }

                if (totalStock == 0)
                {
                    product.Status = ProductConstants.ProductStatusOutOfStock;
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
        /// Updates mutable product information, variants and images after validating seller ownership.
        /// </summary>
        public async Task<ProductResponse> UpdateProductAsync(
            long productId,
            string sellerUserId,
            UpdateProductRequest request)
        {
            if (!ProductConstants.IsAllowedStatus(request.Status))
                throw new AppException(
                    $"Status must be one of: {string.Join(", ", ProductConstants.AllowedStatuses)}.",
                    400);

            var product = await _context.Products
                .Include(x => x.Shop)
                .FirstOrDefaultAsync(x => x.ProductId == productId);

            if (product == null)
                throw new Exception("Product not found");

            if (product.Shop.OwnerId != sellerUserId)
                throw new UnauthorizedAccessException();

            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                if (!string.IsNullOrWhiteSpace(request.Name) && request.Name != product.Name)
                {
                    product.Slug = await SlugHelper.GenerateUniqueSlugAsync(_context.Products, request.Name);
                }

                product.Name = request.Name;
                product.Description = request.Description;
                if (request.CategoryId > 0) product.CategoryId = request.CategoryId;
                if (request.BrandId > 0) product.BrandId = request.BrandId;
                product.Price = request.Price;
                product.DiscountPrice = request.DiscountPrice;
                product.Status = request.Status;
                product.UpdatedAt = DateTime.UtcNow;

                // Sync Images
                var imageList = request.ImageUrls?.Where(url => !string.IsNullOrWhiteSpace(url)).ToList();
                if (imageList != null && imageList.Any())
                {
                    product.Image = imageList.First();

                    var existingImages = await _context.ProductImages
                        .Where(pi => pi.ProductId == productId)
                        .ToListAsync();

                    var removedImages = existingImages
                        .Where(img => !imageList.Contains(img.ImageUrl, StringComparer.OrdinalIgnoreCase))
                        .ToList();

                    if (removedImages.Any())
                    {
                        _context.ProductImages.RemoveRange(removedImages);
                    }

                    for (int i = 0; i < imageList.Count; i++)
                    {
                        var url = imageList[i];
                        var existing = existingImages.FirstOrDefault(img => string.Equals(img.ImageUrl, url, StringComparison.OrdinalIgnoreCase));
                        if (existing != null)
                        {
                            existing.IsPrimary = (i == 0);
                            existing.SortOrder = i;
                            if (i == 0) existing.VariantId = null;
                        }
                        else
                        {
                            var pImg = new ProductImage
                            {
                                ProductId = product.ProductId,
                                ImageUrl = url,
                                IsPrimary = (i == 0),
                                SortOrder = i,
                                CreatedAt = DateTime.UtcNow,
                                VariantId = null
                            };
                            _context.ProductImages.Add(pImg);
                        }
                    }
                }
                else if (request.ImageUrl != null)
                {
                    product.Image = request.ImageUrl;
                }

                int totalStock = 0;

                // Sync Variants
                if (request.Variants != null && request.Variants.Any())
                {
                    var existingVariants = await _context.ProductVariants
                        .Include(v => v.Inventory)
                        .Include(v => v.VariantAttributes)
                        .Include(v => v.Images)
                        .Where(v => v.ProductId == productId)
                        .ToListAsync();

                    var keptVariantIds = new HashSet<long>();

                    var variantIdMap = new List<(CreateVariantRequest Req, long VariantId)>();

                    for (int i = 0; i < request.Variants.Count; i++)
                    {
                        var vReq = request.Variants[i];
                        ProductVariant? matchedVariant = null;

                        if (vReq.VariantId.HasValue && vReq.VariantId.Value > 0)
                        {
                            matchedVariant = existingVariants.FirstOrDefault(v => v.VariantId == vReq.VariantId.Value);
                        }
                        if (matchedVariant == null && !string.IsNullOrWhiteSpace(vReq.Sku))
                        {
                            matchedVariant = existingVariants.FirstOrDefault(v => string.Equals(v.SKU, vReq.Sku.Trim(), StringComparison.OrdinalIgnoreCase));
                        }

                        if (matchedVariant != null)
                        {
                            keptVariantIds.Add(matchedVariant.VariantId);
                            matchedVariant.Price = vReq.Price;
                            matchedVariant.Stock = vReq.InitialStock;
                            if (!string.IsNullOrWhiteSpace(vReq.Sku))
                            {
                                matchedVariant.SKU = vReq.Sku.Trim();
                            }

                            if (matchedVariant.Inventory != null)
                            {
                                matchedVariant.Inventory.AvailableStock = vReq.InitialStock;
                                matchedVariant.Inventory.UpdatedAt = DateTime.UtcNow;
                            }
                            else
                            {
                                _context.Inventories.Add(new Inventory
                                {
                                    ProductVariantId = matchedVariant.VariantId,
                                    AvailableStock = vReq.InitialStock,
                                    ReservedStock = 0,
                                    SoldStock = 0,
                                    CreatedAt = DateTime.UtcNow,
                                    UpdatedAt = DateTime.UtcNow
                                });
                            }

                            _context.VariantAttributes.RemoveRange(matchedVariant.VariantAttributes);
                            await _context.SaveChangesAsync();

                            await ProductAttributeHelper.ProcessVariantAttributesAsync(_context, productId, matchedVariant.VariantId, vReq, request.Variants.Count);

                            variantIdMap.Add((vReq, matchedVariant.VariantId));
                            totalStock += vReq.InitialStock;
                        }
                        else
                        {
                            // Add New Variant
                            var sku = !string.IsNullOrWhiteSpace(vReq.Sku)
                                ? vReq.Sku.Trim()
                                : $"{product.Slug.ToUpper()}-{i + 1}";

                            var newVariant = new ProductVariant
                            {
                                ProductId = product.ProductId,
                                Price = vReq.Price,
                                Stock = vReq.InitialStock,
                                SKU = sku
                            };
                            _context.ProductVariants.Add(newVariant);
                            await _context.SaveChangesAsync();
                            keptVariantIds.Add(newVariant.VariantId);

                            _context.Inventories.Add(new Inventory
                            {
                                ProductVariantId = newVariant.VariantId,
                                AvailableStock = vReq.InitialStock,
                                ReservedStock = 0,
                                SoldStock = 0,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow
                            });

                            await ProductAttributeHelper.ProcessVariantAttributesAsync(_context, productId, newVariant.VariantId, vReq, request.Variants.Count);

                            variantIdMap.Add((vReq, newVariant.VariantId));
                            totalStock += vReq.InitialStock;
                        }
                    }

                    // Handle removed variants
                    var removedVariants = existingVariants.Where(v => !keptVariantIds.Contains(v.VariantId)).ToList();
                    foreach (var oldV in removedVariants)
                    {
                        var isOrdered = await _context.OrderItems.AnyAsync(oi => oi.VariantId == oldV.VariantId);
                        if (isOrdered)
                        {
                            if (oldV.Inventory != null)
                            {
                                oldV.Inventory.AvailableStock = 0;
                                oldV.Inventory.UpdatedAt = DateTime.UtcNow;
                            }
                        }
                        else
                        {
                            var cartItems = await _context.CartItems.Where(ci => ci.VariantId == oldV.VariantId).ToListAsync();
                            if (cartItems.Any()) _context.CartItems.RemoveRange(cartItems);

                            if (oldV.Inventory != null) _context.Inventories.Remove(oldV.Inventory);
                            _context.VariantAttributes.RemoveRange(oldV.VariantAttributes);
                            _context.ProductVariants.Remove(oldV);
                        }
                    }

                    // Re-sync ProductAttributes
                    await ProductAttributeHelper.SyncProductAttributesAsync(_context, productId, keptVariantIds);

                    // ==========================================
                    // Đồng bộ ảnh biến thể (Variant Images)
                    // ==========================================
                    await _context.SaveChangesAsync();

                    var allCurrentImages = await _context.ProductImages
                        .Where(pi => pi.ProductId == productId)
                        .ToListAsync();

                    // 1. Reset các ảnh variant cũ của các kept variants
                    foreach (var vItem in variantIdMap)
                    {
                        var vId = vItem.VariantId;
                        var existingVarImgs = allCurrentImages.Where(pi => pi.VariantId == vId).ToList();
                        foreach (var img in existingVarImgs)
                        {
                            img.VariantId = null;
                        }
                    }

                    // 2. Gán ảnh mới cho từng variant
                    int variantSortOrder = 90;
                    foreach (var vItem in variantIdMap)
                    {
                        var vReq = vItem.Req;
                        var vId = vItem.VariantId;

                        if (!string.IsNullOrWhiteSpace(vReq.ImageUrl))
                        {
                            var targetUrl = vReq.ImageUrl.Trim();

                            var availableImg = allCurrentImages.FirstOrDefault(pi =>
                                string.Equals(pi.ImageUrl, targetUrl, StringComparison.OrdinalIgnoreCase) &&
                                pi.VariantId == null &&
                                !pi.IsPrimary);

                            if (availableImg != null)
                            {
                                availableImg.VariantId = vId;
                            }
                            else
                            {
                                var newVarImg = new ProductImage
                                {
                                    ProductId = productId,
                                    ImageUrl = targetUrl,
                                    IsPrimary = false,
                                    SortOrder = variantSortOrder++,
                                    CreatedAt = DateTime.UtcNow,
                                    VariantId = vId
                                };
                                _context.ProductImages.Add(newVarImg);
                                allCurrentImages.Add(newVarImg);
                            }
                        }
                    }
                }
                else
                {
                    totalStock = request.Stock;
                    var defaultVariant = await _context.ProductVariants
                        .Include(v => v.Inventory)
                        .FirstOrDefaultAsync(v => v.ProductId == productId);
                    if (defaultVariant != null)
                    {
                        defaultVariant.Price = request.Price;
                        defaultVariant.Stock = request.Stock;
                        if (defaultVariant.Inventory != null)
                        {
                            defaultVariant.Inventory.AvailableStock = request.Stock;
                            defaultVariant.Inventory.UpdatedAt = DateTime.UtcNow;
                        }
                    }
                }

                // Update product status based on stock
                if (totalStock == 0)
                {
                    product.Status = ProductConstants.ProductStatusOutOfStock;
                }
                else if (product.Status == ProductConstants.ProductStatusOutOfStock && totalStock > 0)
                {
                    product.Status = ProductConstants.ProductStatusActive;
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
        /// Retrieves complete product details for seller edit flow using ProductMappingExtensions.
        /// </summary>
        public async Task<ProductDetailDto?> GetSellerProductByIdAsync(long productId, string sellerUserId)
        {
            var shop = await _context.Shops.AsNoTracking().FirstOrDefaultAsync(s => s.OwnerId == sellerUserId);
            if (shop == null) return null;

            var product = await _context.Products
                .AsNoTracking()
                .Include(p => p.Shop)
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Inventory)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.VariantAttributes)
                        .ThenInclude(va => va.AttributeValue)
                            .ThenInclude(av => av.AttributeType)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Images)
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.ShopId == shop.ShopId);

            if (product == null) return null;

            return product.ToDetailDto();
        }

        /// <summary>
        /// Soft deletes a product by marking status as deleted, preserving historical order/cart references.
        /// </summary>
        public async Task DeleteProductAsync(long productId, string sellerUserId)
        {
            var product = await _context.Products
                .Include(x => x.Shop)
                .FirstOrDefaultAsync(x => x.ProductId == productId);

            if (product == null)
                throw new Exception("Product not found");

            if (product.Shop.OwnerId != sellerUserId)
                throw new UnauthorizedAccessException();

            product.Status = ProductConstants.ProductStatusDeleted;
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Lấy toàn bộ sản phẩm của seller (bao gồm deleted).
        /// Hỗ trợ search theo tên, filter theo status, sort theo nhiều tiêu chí, pagination.
        /// </summary>
        public async Task<(IEnumerable<ProductListDto> items, int total)> GetProductsBySellerAsync(
            string sellerUserId,
            int page,
            int pageSize,
            string? search,
            string? status,
            string? sortBy)
        {
            var shop = await _context.Shops
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.OwnerId == sellerUserId);

            if (shop == null)
                return (Enumerable.Empty<ProductListDto>(), 0);

            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Inventory)
                .Include(p => p.Images)
                .Where(p => p.ShopId == shop.ShopId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search));

            if (!string.IsNullOrWhiteSpace(status) && status != "all")
                query = query.Where(p => p.Status == status);

            var projected = query.Select(p => new
            {
                Product = p,
                AvailableStock = p.Variants
                    .Sum(v => v.Inventory != null
                        ? v.Inventory.AvailableStock - v.Inventory.ReservedStock
                        : 0),
                SoldCount = p.Variants
                    .Sum(v => v.Inventory != null ? v.Inventory.SoldStock : 0),
                FinalPrice = p.Variants.Any()
                    ? p.Variants.Min(v => (p.DiscountPrice ?? p.Price) + (v.Price ?? 0))
                    : (p.DiscountPrice ?? p.Price)
            });

            // Sort with ProductSortConstants
            projected = sortBy?.ToLower() switch
            {
                ProductSortConstants.PriceAsc => projected.OrderBy(x => x.FinalPrice),
                ProductSortConstants.PriceDesc => projected.OrderByDescending(x => x.FinalPrice),
                ProductSortConstants.Sold => projected.OrderByDescending(x => x.SoldCount),
                ProductSortConstants.StockAsc => projected.OrderBy(x => x.AvailableStock),
                ProductSortConstants.StockDesc => projected.OrderByDescending(x => x.AvailableStock),
                ProductSortConstants.Oldest => projected.OrderBy(x => x.Product.CreatedAt),
                ProductSortConstants.NameAsc => projected.OrderBy(x => x.Product.Name),
                ProductSortConstants.NameDesc => projected.OrderByDescending(x => x.Product.Name),
                _ => projected.OrderByDescending(x => x.Product.CreatedAt)
            };

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
                    Stock = x.AvailableStock,
                    ImageUrl = x.Product.Images
                        .Where(i => i.IsPrimary)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? x.Product.Image,
                    ImageUrls = x.Product.Images.Any()
                        ? x.Product.Images
                            .OrderByDescending(i => i.IsPrimary)
                            .ThenBy(i => i.SortOrder)
                            .Select(i => i.ImageUrl)
                            .ToList()
                        : (!string.IsNullOrEmpty(x.Product.Image) ? new List<string> { x.Product.Image } : new List<string>()),
                    RatingAvg = x.Product.RatingAvg,
                    RatingCount = x.Product.RatingCount,
                    CategoryId = x.Product.CategoryId,
                    BrandId = x.Product.BrandId,
                    CategoryName = x.Product.Category != null ? x.Product.Category.Type : null,
                    BrandName = x.Product.Brand != null ? x.Product.Brand.Name : null,
                    Status = x.Product.Status,
                    CreatedAt = x.Product.CreatedAt,
                    SoldCount = x.SoldCount,
                    Description = x.Product.Description
                })
                .ToListAsync();

            return (items, total);
        }
    }
}
