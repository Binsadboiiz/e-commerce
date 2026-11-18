using BE.Data;
using BE.Middlewares;
using BE.Models.DTOs;
using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Orders
{
    public partial class OrderService
    {
        private async Task<CheckoutPricingResult> BuildPricingAsync(List<CheckoutSourceItem> sourceItems, List<string> voucherCodes)
        {
            if (sourceItems.Count == 0)
            {
                throw new AppException("There are no items to checkout.");
            }

            var subtotal = sourceItems.Sum(item => item.LineTotal);
            var shippingFee = CalculateShippingFee(sourceItems);
            var vouchers = await LoadValidVouchersAsync(voucherCodes);
            var discountAmount = CalculateDiscountAmount(sourceItems, subtotal, shippingFee, vouchers, out decimal shippingDiscount);
            var totalDiscount = discountAmount + shippingDiscount;
            var finalAmount = Math.Max(0, subtotal + shippingFee - totalDiscount);

            return new CheckoutPricingResult
            {
                Items = sourceItems.Select(item => new CheckoutItemDto {
                    // Map sang DTO để trả về Client
                    ProductId = item.ProductId,
                    ShopId = item.ShopId,
                    VariantId = item.VariantId,
                    ProductName = item.ProductName,
                    ProductImage = item.ProductImage,
                    VariantName = item.VariantName,
                    VariantValue = item.VariantValue,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                    LineTotal = item.LineTotal
                }).ToList(),
                Vouchers = vouchers,
                SourceItems = sourceItems,
                MerchandiseSubtotal = subtotal,
                ShippingFee = shippingFee,
                DiscountAmount = totalDiscount,
                FinalAmount = finalAmount
            };
        }

        private async Task<List<Voucher>> LoadValidVouchersAsync(List<string> voucherCodes)
        {
            if (voucherCodes == null || voucherCodes.Count == 0) return new List<Voucher>();

            var normalizedCodes = voucherCodes
                .Where(code => !string.IsNullOrWhiteSpace(code))
                .Select(code => code.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (normalizedCodes.Count == 0) return new List<Voucher>();

            var vouchers = await _context.Vouchers
                .Where(v => normalizedCodes.Contains(v.Code) && v.IsActive)
                .ToListAsync();

            if (vouchers.Count != normalizedCodes.Count)
            {
                throw new AppException("One or more voucher codes are invalid.");
            }

            var now = DateTime.UtcNow;
            var expiredVoucher = vouchers.FirstOrDefault(v => v.ExpiredAt.HasValue && v.ExpiredAt.Value < now);
            if (expiredVoucher != null)
            {
                throw new AppException($"Voucher '{expiredVoucher.Code}' has expired.");
            }

            var limitReachedVoucher = vouchers.FirstOrDefault(v => v.UsageLimit.HasValue && v.UsageCount >= v.UsageLimit.Value);
            if (limitReachedVoucher != null)
            {
                throw new AppException($"Voucher '{limitReachedVoucher.Code}' usage limit has been reached.");
            }

            return vouchers;
        }

        private decimal CalculateDiscountAmount(
            List<CheckoutSourceItem> sourceItems,
            decimal subtotal,
            decimal shippingFee,
            List<Voucher> vouchers,
            out decimal shippingDiscount)
        {
            decimal merchandiseDiscount = 0;
            shippingDiscount = 0;

            foreach (var voucher in vouchers)
            {
                decimal applicableSubtotal = 0;
                if (voucher.VoucherType == "Shipping")
                {
                    applicableSubtotal = subtotal;
                }
                else
                {
                    // Filter products applicable for the voucher: by ShopId (if seller voucher) and CategoryId (if category type voucher)
                    var items = sourceItems.AsEnumerable();
                    if (voucher.ShopId.HasValue)
                    {
                        items = items.Where(i => i.ShopId == voucher.ShopId.Value);
                    }
                    if (voucher.VoucherType == "Category" && voucher.CategoryId.HasValue)
                    {
                        items = items.Where(i => i.CategoryId == voucher.CategoryId.Value);
                    }
                    applicableSubtotal = items.Sum(i => i.LineTotal);
                }

                // If no items are valid to apply the voucher (except shipping vouchers)
                if (applicableSubtotal <= 0 && voucher.VoucherType != "Shipping")
                {
                    throw new AppException($"Voucher '{voucher.Code}' is not applicable to any items in your checkout.");
                }

                // Check minimum order value condition
                if (voucher.MinOrderValue.HasValue && applicableSubtotal < (decimal)voucher.MinOrderValue.Value)
                {
                    throw new AppException($"Voucher '{voucher.Code}' requires a minimum order value of {voucher.MinOrderValue.Value:N0} VND.");
                }

                if (voucher.VoucherType == "Shipping")
                {
                    decimal maxShippingToDiscount = shippingFee;
                    if (voucher.ShopId.HasValue)
                    {
                        var hasItemsFromShop = sourceItems.Any(i => i.ShopId == voucher.ShopId.Value);
                        if (!hasItemsFromShop)
                        {
                            throw new AppException($"Voucher '{voucher.Code}' is only applicable for shop shipping fee.");
                        }
                        maxShippingToDiscount = 22000m; // Default shop shipping fee
                    }

                    decimal discountValue = voucher.DiscountType.ToLowerInvariant() switch
                    {
                        "percent" or "percentage" => shippingFee * ((decimal)voucher.Value / 100m),
                        "fixed" => (decimal)voucher.Value,
                        _ => throw new AppException($"Voucher '{voucher.Code}' has unsupported discount type.")
                    };

                    if (voucher.MaxDiscount.HasValue)
                    {
                        discountValue = Math.Min(discountValue, (decimal)voucher.MaxDiscount.Value);
                    }

                    shippingDiscount += Math.Min(discountValue, maxShippingToDiscount);
                }
                else
                {
                    decimal discountValue = voucher.DiscountType.ToLowerInvariant() switch
                    {
                        "percent" or "percentage" => applicableSubtotal * ((decimal)voucher.Value / 100m),
                        "fixed" => (decimal)voucher.Value,
                        _ => throw new AppException($"Voucher '{voucher.Code}' has unsupported discount type.")
                    };

                    if (voucher.MaxDiscount.HasValue)
                    {
                        discountValue = Math.Min(discountValue, (decimal)voucher.MaxDiscount.Value);
                    }

                    merchandiseDiscount += Math.Min(discountValue, applicableSubtotal);
                }
            }

            shippingDiscount = Math.Min(shippingDiscount, shippingFee);
            merchandiseDiscount = Math.Min(merchandiseDiscount, subtotal);

            return merchandiseDiscount;
        }

        private decimal CalculateShippingFee(List<CheckoutSourceItem> items)
        {
            var uniqueShopCount = items.Select(item => item.ShopId).Distinct().Count();
            return uniqueShopCount * 22000m;
        }

        private decimal GetUnitPrice(Product product, ProductVariant? variant)
        {
            var productPrice = product.DiscountPrice ?? product.Price;
            var finalPrice = variant?.Price ?? productPrice;

            return finalPrice;
        }

        private void ValidateStock(Product product, ProductVariant? variant, int quantity)
        {
            if (variant != null)
            {
                ValidateInventoryStock(variant, quantity);
                return;
            }
        }

        private void ValidateInventoryStock(ProductVariant variant, int quantity)
        {
            var inventory = variant.Inventory;

            if (inventory == null)
                throw new AppException($"Inventory not found for variant {variant.VariantId}.");

            var available = inventory.AvailableStock - inventory.ReservedStock;

            if (available < quantity)
                throw new AppException($"Insufficient stock. Available: {available}, Requested: {quantity}");
        }
    }
}
