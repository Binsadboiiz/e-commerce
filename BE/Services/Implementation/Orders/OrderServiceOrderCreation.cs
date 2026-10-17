using BE.Constants;
using BE.Data;
using BE.Models.DTOs;
using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Orders
{
    public partial class OrderService
    {
        private CheckoutPreviewResponse BuildPreviewResponse(string checkoutType, string paymentMethod, UserAddresses address, CheckoutPricingResult pricing)
        {
            return new CheckoutPreviewResponse
            {
                CheckoutType = checkoutType,
                PaymentMethod = paymentMethod,
                Address = address != null ? new CheckoutAddressDto
                {
                    Id = address.Id,
                    FullName = address.FullName,
                    PhoneNumber = address.PhoneNumber.ToString(),
                    City = address.City,
                    StreetName = address.StreetName,
                    HouseNo = address.HouseNo,
                    IsDefault = address.IsDefault
                } : null,
                Items = pricing.Items,
                AppliedVoucherCodes = pricing.Vouchers.Select(v => v.Code).ToList(),
                MerchandiseSubtotal = pricing.MerchandiseSubtotal,
                ShippingFee = pricing.ShippingFee,
                DiscountAmount = pricing.DiscountAmount,
                FinalAmount = pricing.FinalAmount
            };
        }

        private async Task<Order> CreateOrderAsync(string userId, UserAddresses address, string paymentMethod, CheckoutPricingResult pricing)
        {
            var createdAt = DateTime.UtcNow;
            var order = new Order
            {
                CustomerId = userId,
                AddressId = address.Id,
                PaymentMethod = paymentMethod,
                PaymentStatus = "pending",
                Status = "pending",
                MerchandiseSubtotal = pricing.MerchandiseSubtotal,
                ShippingFee = pricing.ShippingFee,
                DiscountAmount = pricing.DiscountAmount,
                FinalAmount = pricing.FinalAmount,
                Create_At = createdAt,
                OrderItems = new List<OrderItem>(),
                OrderVouchers = new List<OrderVoucher>(),
                OrderTrackings = new List<OrderTracking>
                {
                    new OrderTracking
                    {
                        Status = "pending",
                        Description = "Your order has been placed successfully.",
                        UpdatedBy = "system",
                        CreatedAt = createdAt
                    }
                },
                ShippingDetail = new ShippingDetail
                {
                    Status = "pending",
                    UpdatedAt = createdAt
                }
            };

            // Save products in the order
            foreach (var item in pricing.SourceItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    ShopId = item.ShopId,
                    ProductId = item.ProductId,
                    VariantId = item.VariantId,
                    ProductName = item.ProductName,
                    ProductImage = item.ProductImage,
                    VariantName = item.VariantName,
                    VariantValue = item.VariantValue,
                    Price = item.UnitPrice,
                    Quantity = item.Quantity,
                    SellerStatus = TrackingStatus.Pending
                });
            }

            // Record the applied Vouchers
            foreach (var voucher in pricing.Vouchers)
            {
                order.OrderVouchers.Add(new OrderVoucher { VoucherId = voucher.Id });
                voucher.UsageCount++; // Increment the voucher usage count
            }

            // Initialize payment transaction
            order.PaymentTransaction = new PaymentTransaction
            {
                Method = paymentMethod,
                Status = "pending"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }
    }
}
