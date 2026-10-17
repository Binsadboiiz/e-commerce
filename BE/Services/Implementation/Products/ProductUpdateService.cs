using BE.Constants;
using BE.Data;
using BE.Helpers;
using BE.Middlewares;
using BE.Models.DTOs;
using BE.Models.DTOs.Products;
using BE.Models.Entities;
using BE.Services.Interface.Product;
using BE.Utils;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Products
{
    public class ProductUpdateService : IProductUpdateService
    {
        private readonly ApplicationDbContext _context;

        public ProductUpdateService(ApplicationDbContext context)
        {
            _context = context;
        }

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
    }
}
