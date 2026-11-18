using BE.Constants;
using BE.Data;
using BE.Models.DTOs;
using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Helpers
{
    /// <summary>
    /// Helper to process and synchronize product and variant attributes.
    /// Encapsulates normalization, lookup/creation, and association logic.
    /// </summary>
    public static class ProductAttributeHelper
    {
        /// <summary>
        /// Normalizes raw attribute type name to standardized PascalCase (e.g., Color, Size).
        /// </summary>
        public static string NormalizeAttributeTypeName(string? rawName)
        {
            if (string.IsNullOrWhiteSpace(rawName))
                return ProductAttributeConstants.Option;

            var trimmed = rawName.Trim();
            var lower = trimmed.ToLowerInvariant();

            if (lower is "color" or "colour" or "màu" or "màu sắc")
                return ProductAttributeConstants.Color;
            if (lower is "size" or "kích thước" or "kích cỡ" or "cỡ")
                return ProductAttributeConstants.Size;
            if (lower is "material" or "chất liệu")
                return ProductAttributeConstants.Material;
            if (lower is "style" or "kiểu dáng")
                return ProductAttributeConstants.Style;

            return char.ToUpperInvariant(trimmed[0]) + trimmed.Substring(1);
        }

        /// <summary>
        /// Retrieves an existing AttributeValue ID or creates the AttributeType and AttributeValue if they don't exist.
        /// </summary>
        public static async Task<long> GetOrCreateAttributeValueIdAsync(ApplicationDbContext context, string typeName, string valName)
        {
            var attrType = await context.AttributeTypes
                .FirstOrDefaultAsync(t => t.Name.ToLower() == typeName.ToLower());

            if (attrType == null)
            {
                attrType = new AttributeType { Name = typeName };
                context.AttributeTypes.Add(attrType);
                await context.SaveChangesAsync();
            }

            var attrVal = await context.AttributeValues
                .FirstOrDefaultAsync(v => v.AttributeId == attrType.AttributeId && v.Value.ToLower() == valName.ToLower());

            if (attrVal == null)
            {
                attrVal = new AttributeValue
                {
                    AttributeId = attrType.AttributeId,
                    Value = valName
                };
                context.AttributeValues.Add(attrVal);
                await context.SaveChangesAsync();
            }

            return attrVal.ValueId;
        }

        /// <summary>
        /// Ensures a ProductAttribute record links the Product with the specified ValueId.
        /// Checks both database and DbContext.Local to prevent duplicate tracking.
        /// </summary>
        public static async Task EnsureProductAttributeAsync(ApplicationDbContext context, long productId, long valueId)
        {
            var existsInDb = await context.ProductAttributes
                .AnyAsync(pa => pa.ProductId == productId && pa.ValueId == valueId);

            if (!existsInDb && !context.ProductAttributes.Local.Any(pa => pa.ProductId == productId && pa.ValueId == valueId))
            {
                context.ProductAttributes.Add(new ProductAttribute
                {
                    ProductId = productId,
                    ValueId = valueId
                });
            }
        }

        /// <summary>
        /// Processes attributes for a given variant, supporting both structured Attributes and fallback VariantName splitting.
        /// </summary>
        public static async Task ProcessVariantAttributesAsync(
            ApplicationDbContext context,
            long productId,
            long variantId,
            CreateVariantRequest variantRequest,
            int totalVariantsCount)
        {
            if (variantRequest.Attributes != null && variantRequest.Attributes.Any())
            {
                foreach (var attrReq in variantRequest.Attributes)
                {
                    if (attrReq.AttributeValueId.HasValue && attrReq.AttributeValueId.Value > 0)
                    {
                        var exists = await context.AttributeValues.AnyAsync(av => av.ValueId == attrReq.AttributeValueId.Value);
                        if (exists)
                        {
                            context.VariantAttributes.Add(new VariantAttribute
                            {
                                VariantId = variantId,
                                ValueId = attrReq.AttributeValueId.Value
                            });
                            await EnsureProductAttributeAsync(context, productId, attrReq.AttributeValueId.Value);
                        }
                    }
                    else if (!string.IsNullOrWhiteSpace(attrReq.Value))
                    {
                        var typeName = NormalizeAttributeTypeName(attrReq.AttributeName);
                        var valId = await GetOrCreateAttributeValueIdAsync(context, typeName, attrReq.Value.Trim());
                        context.VariantAttributes.Add(new VariantAttribute
                        {
                            VariantId = variantId,
                            ValueId = valId
                        });
                        await EnsureProductAttributeAsync(context, productId, valId);
                    }
                }
            }
            else if (!string.IsNullOrWhiteSpace(variantRequest.VariantName) &&
                     (totalVariantsCount > 1 || !variantRequest.VariantName.Trim().Equals(ProductAttributeConstants.DefaultVariantName, StringComparison.OrdinalIgnoreCase)))
            {
                var parts = variantRequest.VariantName.Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                if (parts.Length == 2)
                {
                    var valId1 = await GetOrCreateAttributeValueIdAsync(context, ProductAttributeConstants.Color, parts[0]);
                    context.VariantAttributes.Add(new VariantAttribute { VariantId = variantId, ValueId = valId1 });
                    await EnsureProductAttributeAsync(context, productId, valId1);

                    var valId2 = await GetOrCreateAttributeValueIdAsync(context, ProductAttributeConstants.Size, parts[1]);
                    context.VariantAttributes.Add(new VariantAttribute { VariantId = variantId, ValueId = valId2 });
                    await EnsureProductAttributeAsync(context, productId, valId2);
                }
                else if (parts.Length > 0)
                {
                    var valId = await GetOrCreateAttributeValueIdAsync(context, ProductAttributeConstants.Option, parts[0]);
                    context.VariantAttributes.Add(new VariantAttribute { VariantId = variantId, ValueId = valId });
                    await EnsureProductAttributeAsync(context, productId, valId);
                }
            }

            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Synchronizes ProductAttributes for a product based on its active variants, removing unused attributes.
        /// </summary>
        public static async Task SyncProductAttributesAsync(
            ApplicationDbContext context,
            long productId,
            IEnumerable<long> activeVariantIds)
        {
            var variantIdList = activeVariantIds.ToList();
            var activeValueIds = await context.VariantAttributes
                .Where(va => variantIdList.Contains(va.VariantId))
                .Select(va => va.ValueId)
                .Distinct()
                .ToListAsync();

            var oldProdAttrs = await context.ProductAttributes
                .Where(pa => pa.ProductId == productId && !activeValueIds.Contains(pa.ValueId))
                .ToListAsync();

            if (oldProdAttrs.Any())
            {
                context.ProductAttributes.RemoveRange(oldProdAttrs);
            }

            foreach (var valId in activeValueIds)
            {
                await EnsureProductAttributeAsync(context, productId, valId);
            }
        }
    }
}
