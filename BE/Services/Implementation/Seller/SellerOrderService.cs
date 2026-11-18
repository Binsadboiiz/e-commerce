using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Constants;
using BE.Middlewares;
using BE.Models.DTOs.Seller;
using BE.Models.Entities;
using BE.Repositories.Interfaces.Seller;
using BE.Services.Interface.Seller;
using BE.Validators;

namespace BE.Services.Implementation.Seller
{
    public class SellerOrderService : ISellerOrderService
    {
        private readonly ISellerOrderRepository _repository;

        public SellerOrderService(ISellerOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<(List<SellerOrderListDto> Items, int Total)> GetOrdersAsync(
            string userId, string? status, int page, int pageSize)
        {
            var shopIds = await _repository.GetSellerShopIdsAsync(userId);
            if (shopIds == null || !shopIds.Any())
            {
                return (new List<SellerOrderListDto>(), 0);
            }

            var orders = await _repository.GetOrdersAsync(shopIds, status, page, pageSize);
            var total = await _repository.CountOrdersAsync(shopIds, status);

            var items = orders.Select(o =>
            {
                var sellerItems = o.OrderItems.Where(item => shopIds.Contains(item.ShopId)).ToList();
                var sellerTotal = sellerItems.Sum(item => item.Price * item.Quantity);
                var itemCount = sellerItems.Sum(item => item.Quantity);
                var resolvedStatus = ResolveItemsStatus(sellerItems);

                return new SellerOrderListDto
                {
                    OrderId = o.OrderId,
                    CustomerName = o.Customer?.FullName ?? "Unknown Customer",
                    ItemCount = itemCount,
                    SellerTotal = sellerTotal,
                    PaymentMethod = o.PaymentMethod,
                    PaymentStatus = o.PaymentStatus,
                    CreatedAt = o.Create_At,
                    Status = resolvedStatus
                };
            }).ToList();

            return (items, total);
        }

        public async Task<SellerOrderDetailDto?> GetOrderDetailAsync(long orderId, string userId)
        {
            var shopIds = await _repository.GetSellerShopIdsAsync(userId);
            if (shopIds == null || !shopIds.Any())
            {
                throw new AppException("Seller does not have any active shop.", 403);
            }

            var order = await _repository.GetOrderDetailAsync(orderId, shopIds);
            if (order == null)
            {
                return null;
            }

            var sellerItems = order.OrderItems.Where(item => shopIds.Contains(item.ShopId)).ToList();
            var sellerTotal = sellerItems.Sum(item => item.Price * item.Quantity);

            return new SellerOrderDetailDto
            {
                OrderId = order.OrderId,
                CustomerName = order.Customer?.FullName ?? "Unknown Customer",
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                CreatedAt = order.Create_At,
                SellerTotal = sellerTotal,
                Items = sellerItems.Select(item => new SellerOrderItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    ProductImage = item.ProductImage,
                    VariantName = item.VariantName,
                    VariantValue = item.VariantValue,
                    Price = item.Price,
                    Quantity = item.Quantity,
                    Status = item.SellerStatus
                }).ToList()
            };
        }

        public async Task UpdateOrderStatusAsync(long orderId, string userId, UpdateSellerOrderStatusRequest request)
        {
            // 1. Validate the basic request payload
            SellerOrderValidator.ValidateUpdateStatusRequest(request);

            // 2. Fetch the shop IDs belonging to the seller
            var shopIds = await _repository.GetSellerShopIdsAsync(userId);
            if (shopIds == null || !shopIds.Any())
            {
                throw new AppException("Seller does not have any active shop.", 403);
            }

            // 3. Retrieve the order for tracking modifications (without AsNoTracking)
            var order = await _repository.GetOrderForUpdateAsync(orderId, shopIds);
            if (order == null)
            {
                throw new AppException("Order not found or you do not have permission to manage this order.", 404);
            }

            // 4. Filter the items to only those belonging to the seller's shops
            var sellerItems = order.OrderItems.Where(item => shopIds.Contains(item.ShopId)).ToList();
            if (!sellerItems.Any())
            {
                throw new AppException("No items in this order belong to your shop.", 400);
            }

            var targetStatus = request.Status.ToLower().Trim();

            // 5. Validate the transition status logic for each item
            foreach (var item in sellerItems)
            {
                if (item.SellerStatus == targetStatus)
                {
                    continue; // Skip if already in target status
                }

                if (!TrackingStatusTransitionValidator.IsValidTransition(item.SellerStatus, targetStatus))
                {
                    throw new AppException($"Invalid status transition for item '{item.ProductName}': {item.SellerStatus} -> {targetStatus}", 400);
                }
            }

            // 6. Update the items' status and record which shops had items updated
            var updatedShopIds = new HashSet<long>();
            foreach (var item in sellerItems)
            {
                if (item.SellerStatus != targetStatus)
                {
                    item.SellerStatus = targetStatus;
                    updatedShopIds.Add(item.ShopId);
                }
            }

            // 7. Write OrderTracking records for each updated shop
            foreach (var shopId in updatedShopIds)
            {
                var tracking = new OrderTracking
                {
                    OrderId = order.OrderId,
                    ShopId = shopId,
                    Status = targetStatus,
                    Location = request.Location,
                    Description = !string.IsNullOrWhiteSpace(request.Description)
                        ? request.Description
                        : $"Shop updated status of items in order to '{targetStatus}'.",
                    UpdatedBy = $"Seller (Shop ID: {shopId})",
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.AddTrackingAsync(tracking);
            }

            // 8. Recalculate and update the overall order status
            UpdateOverallOrderStatus(order);

            // 9. Save changes
            await _repository.SaveChangesAsync();
        }

        private string ResolveItemsStatus(List<OrderItem> items)
        {
            if (!items.Any()) return TrackingStatus.Pending;

            var activeItems = items.Where(i => i.SellerStatus != TrackingStatus.Cancelled).ToList();
            if (!activeItems.Any()) return TrackingStatus.Cancelled;

            var statusRanks = new Dictionary<string, int>
            {
                { TrackingStatus.Pending, 0 },
                { TrackingStatus.Confirmed, 1 },
                { TrackingStatus.Preparing, 2 },
                { TrackingStatus.Shipped, 3 },
                { TrackingStatus.InTransit, 4 },
                { TrackingStatus.OutForDelivery, 5 },
                { TrackingStatus.DeliveryFailed, 6 },
                { TrackingStatus.Delivered, 7 }
            };

            var minRank = activeItems
                .Select(i => statusRanks.TryGetValue(i.SellerStatus, out var rank) ? rank : 0)
                .Min();

            return statusRanks.FirstOrDefault(x => x.Value == minRank).Key ?? TrackingStatus.Pending;
        }

        private void UpdateOverallOrderStatus(Order order)
        {
            var allItems = order.OrderItems.ToList();
            if (!allItems.Any()) return;

            var activeItems = allItems.Where(i => i.SellerStatus != TrackingStatus.Cancelled).ToList();
            if (!activeItems.Any())
            {
                if (order.Status != TrackingStatus.Cancelled)
                {
                    order.Status = TrackingStatus.Cancelled;
                    if (order.ShippingDetail != null)
                    {
                        order.ShippingDetail.Status = TrackingStatus.Cancelled;
                        order.ShippingDetail.UpdatedAt = DateTime.UtcNow;
                    }
                    order.OrderTrackings.Add(new OrderTracking
                    {
                        OrderId = order.OrderId,
                        Status = TrackingStatus.Cancelled,
                        Description = "All items in the order have been cancelled.",
                        UpdatedBy = "system",
                        CreatedAt = DateTime.UtcNow
                    });
                }
                return;
            }

            var statusRanks = new Dictionary<string, int>
            {
                { TrackingStatus.Pending, 0 },
                { TrackingStatus.Confirmed, 1 },
                { TrackingStatus.Preparing, 2 },
                { TrackingStatus.Shipped, 3 },
                { TrackingStatus.InTransit, 4 },
                { TrackingStatus.OutForDelivery, 5 },
                { TrackingStatus.DeliveryFailed, 6 },
                { TrackingStatus.Delivered, 7 }
            };

            var minRank = activeItems
                .Select(i => statusRanks.TryGetValue(i.SellerStatus, out var rank) ? rank : 0)
                .Min();

            var resolvedStatus = statusRanks.FirstOrDefault(x => x.Value == minRank).Key ?? TrackingStatus.Pending;

            if (order.Status != resolvedStatus)
            {
                order.Status = resolvedStatus;
                if (order.ShippingDetail != null)
                {
                    order.ShippingDetail.Status = resolvedStatus;
                    order.ShippingDetail.UpdatedAt = DateTime.UtcNow;
                }

                order.OrderTrackings.Add(new OrderTracking
                {
                    OrderId = order.OrderId,
                    Status = resolvedStatus,
                    Description = $"Order status automatically synchronized to '{resolvedStatus}' based on items.",
                    UpdatedBy = "system",
                    CreatedAt = DateTime.UtcNow
                });
            }
        }
    }
}
