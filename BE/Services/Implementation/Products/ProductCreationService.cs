using BE.Constants;
using BE.Data;
using BE.Helpers;
using BE.Models.DTOs;
using BE.Models.DTOs.Products;
using BE.Models.Entities;
using BE.Services.Interface.Product;
using BE.Utils;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Products
{
    public class ProductCreationService : IProductCreationService
    {
        private readonly ApplicationDbContext _context;

        public ProductCreationService(ApplicationDbContext context)
        {
            _context = context;
        }

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
    }
}
