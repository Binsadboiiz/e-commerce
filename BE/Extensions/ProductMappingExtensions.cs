using BE.Constants;
using BE.Models.DTOs;
using BE.Models.DTOs.Products;
using BE.Models.DTOs.Products.ProductDetail;
using BE.Models.Entities;

namespace BE.Extensions
{
    public static class ProductMappingExtensions
    {
        public static int GetAvailableStock(this Inventory? inventory, int fallback = 0)
        {
            if (inventory == null) return fallback;
            return inventory.AvailableStock - inventory.ReservedStock;
        }

        public static List<ProductAttributeGroupDto> ExtractAttributeGroups(this IEnumerable<ProductVariant> variants)
        {
            return variants
                .SelectMany(v => v.VariantAttributes)
                .Where(va => va != null && va.AttributeValue != null && va.AttributeValue.AttributeType != null)
                .GroupBy(va => new
                {
                    va.AttributeValue.AttributeId,
                    va.AttributeValue.AttributeType.Name
                })
                .Select(g => new ProductAttributeGroupDto
                {
                    AttributeId = g.Key.AttributeId,
                    AttributeName = g.Key.Name,
                    AttributeValues = g
                        .GroupBy(x => new { x.ValueId, x.AttributeValue.Value })
                        .Select(x => new ProductAttributeValueDto
                        {
                            ValueId = x.Key.ValueId,
                            Value = x.Key.Value
                        }).ToList()
                }).ToList();
        }

        public static Dictionary<string, long> BuildVariantMap(this IEnumerable<ProductVariantDto> variants)
        {
            var map = new Dictionary<string, long>();
            foreach (var v in variants)
            {
                if (v.Attributes != null && v.Attributes.Any())
                {
                    var key = string.Join("-", v.Attributes.OrderBy(a => a.AttributeId).Select(a => a.ValueId));
                    if (!string.IsNullOrEmpty(key) && !map.ContainsKey(key))
                    {
                        map[key] = v.VariantId;
                    }
                }
            }
            return map;
        }

        public static ProductVariantDto ToVariantDto(this ProductVariant v, decimal fallbackPrice)
        {
            var available = v.Inventory.GetAvailableStock(v.Stock ?? 0);
            return new ProductVariantDto
            {
                VariantId = v.VariantId,
                Price = v.Price ?? fallbackPrice,
                AvailableStock = available,
                SKU = v.SKU ?? string.Empty,
                IsAvailable = available > 0,
                ImageUrl = v.Images.FirstOrDefault()?.ImageUrl,
                ImageIds = v.Images.Select(i => i.ImageId).ToList(),
                VariantName = v.VariantAttributes.Any()
                    ? string.Join(" / ", v.VariantAttributes.Where(va => va.AttributeValue != null).Select(va => va.AttributeValue.Value))
                    : ProductAttributeConstants.DefaultVariantName,
                Attributes = v.VariantAttributes
                    .Where(va => va.AttributeValue != null && va.AttributeValue.AttributeType != null)
                    .Select(va => new VariantAttributeDto
                    {
                        AttributeId = va.AttributeValue.AttributeId,
                        AttributeName = va.AttributeValue.AttributeType.Name,
                        ValueId = va.ValueId,
                        Value = va.AttributeValue.Value
                    }).ToList()
            };
        }

        public static ProductDetailDto ToDetailDto(this Product product)
        {
            var images = product.Images
                .OrderBy(i => i.SortOrder)
                .GroupBy(i => i.ImageUrl, StringComparer.OrdinalIgnoreCase)
                .Select(g => g.First())
                .Select(i => new ProductImageDto
                {
                    ImageId = i.ImageId,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary,
                    SortOrder = i.SortOrder,
                    VariantId = i.VariantId
                }).ToList();

            if (!images.Any() && !string.IsNullOrWhiteSpace(product.Image))
            {
                images.Add(new ProductImageDto
                {
                    ImageId = 0,
                    ImageUrl = product.Image,
                    IsPrimary = true,
                    SortOrder = 0
                });
            }

            var variants = (product.Variants ?? Enumerable.Empty<ProductVariant>())
                .Select(v => v.ToVariantDto(product.DiscountPrice ?? product.Price))
                .ToList();

            var dto = new ProductDetailDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Slug = product.Slug,
                Description = product.Description,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                RatingAvg = product.RatingAvg,
                RatingCount = product.RatingCount,
                CategoryId = product.CategoryId,
                BrandId = product.BrandId,
                CategoryName = product.Category?.Type,
                BrandName = product.Brand?.Name,
                Status = product.Status,
                HasVariants = product.Variants != null && (product.Variants.Count > 1 || (product.Variants.Count == 1 && product.Variants.First().VariantAttributes.Any())),
                Images = images,
                Variants = variants,
                Attributes = (product.Variants ?? Enumerable.Empty<ProductVariant>()).ExtractAttributeGroups(),
                VariantMap = variants.BuildVariantMap(),
                Shop = product.Shop == null ? null : new ShopInfoDto
                {
                    ShopId = product.Shop.ShopId,
                    ShopName = product.Shop.Name,
                    ShopAvatar = product.Shop.Logo,
                    Status = product.Shop.Status,
                    IsOnline = product.Shop.IsActive,
                    JoinedAt = product.Shop.Create_At,
                    Rating = product.Shop.Products != null && product.Shop.Products.Any() ? (float)product.Shop.Products.Average(x => x.RatingAvg) : 0f,
                    ProductCount = product.Shop.Products?.Count() ?? 0,
                    Followers = 0,
                    ResponseRate = 0,
                    ResponseTime = "--"
                }
            };

            return dto;
        }
    }
}
