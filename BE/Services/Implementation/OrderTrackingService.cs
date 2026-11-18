using BE.Data;
using BE.Models.DTOs;
using BE.Models.Entities;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using BE.Validators;

namespace BE.Services.Implementation
{
    /// <summary>
    /// Service implementation for managing order tracking lifecycles.
    /// Handles retrieval of tracking history and transactional updates of order statuses.
    /// </summary>
    public class OrderTrackingService : IOrderTrackingService
    {
        private readonly ApplicationDbContext _context;

        public OrderTrackingService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        //======================================================================
        // Retrieves detailed tracking information for a specific order
        //======================================================================
        public async Task<OrderTrackingResponse> 
            GetOrderTrackingAsync(long orderId, string userId)
        {
            try
            {
                // Fetch order with related tracking events, shipping details, and line items
                var order = await _context.Orders
                    .Include(o => o.OrderTrackings)
                    .Include(o => o.ShippingDetail)
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync((o => o.OrderId == orderId
                                               && o.CustomerId == userId));
                
                if(order == null)
                {
                    // NOTICE: Retrieval failed - Order not found or ownership mismatch
                    throw new KeyNotFoundException("Order not found");
                }

                // NOTICE: Retrieval success - Order data mapped to response DTO
                return MapTrackingResponse(order);
            }
            catch(Exception ex)
            {
                // NOTICE: Critical failure during data fetch operation
                throw new Exception($"Error retrieving for order {orderId}", ex);
            }
        }
        
        //======================================================================
        // Retrieves a summary list of all orders belonging to a specific user
        //======================================================================
        public async Task<List<MyOrderDto>> GetUserOrderAsync(string userId)
        {
            try
            {
                // Using AsNoTracking to optimize read-only performance and reduce memory overhead
                var orders = await _context.Orders
                    .AsNoTracking()
                    .Include(x => x.OrderItems)
                    .Where(x => x.CustomerId == userId)
                    .OrderByDescending(x => x.Create_At)
                    .ToListAsync();

                // NOTICE: Retrieval success - Collection of orders fetched for user {userId}
                return orders.Select(MapMyOrder).ToList();
            }
            catch(Exception ex)
            {
                // NOTICE: Retrieval failed - Database connection or query execution error
                throw new Exception($"Error retrieving for user {userId}", ex);
            }
        }
        
        //======================================================================
        // Updates order status and persists a new tracking event (Atomic Transaction)
        //======================================================================
        public async Task UpdateOrderStatusAsync(long orderId, UpdateTrackingStatusRequest request)
        {
            // Initiate database transaction to ensure Atomicity and Consistency
            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                var order = await _context.Orders
                    .Include(x => x.ShippingDetail)
                    .FirstOrDefaultAsync(x => x.OrderId == orderId);
                
                if(order == null)
                    throw new Exception("Order not found");
                
                // 1. Update primary order state
                if(!TrackingStatusTransitionValidator.TrackingStatusValidator
                       .IsValidStatus(request.Status))
                {
                    throw new Exception(
                        "Invalid tracking status.");
                }
                
                if (!TrackingStatusTransitionValidator
                        .IsValidTransition(order.Status, request.Status))
                {
                    throw new Exception($"Invalid status transition " +
                                        $"{order.Status} -> {request.Status}");
                }
                order.Status = request.Status;

                
                
                // 2. Instantiate new tracking event entity
                var tracking = new OrderTracking
                {
                    OrderId = orderId,
                    Status = request.Status,
                    Location = request.Location,
                    Description = request.Description,
                    UpdatedBy = request.UpdatedBy,
                    CreatedAt = DateTime.UtcNow
                };

                _context.OrderTrackings.Add(tracking);
                
                // 3. Synchronize data with ShippingDetail entity if present
                if (order.ShippingDetail != null)
                {
                    order.ShippingDetail.Status = request.Status;
                    order.ShippingDetail.CurrentLocation = request.Location;
                    order.ShippingDetail.UpdatedAt = DateTime.UtcNow;
                }

                // Persist changes to the database
                await _context.SaveChangesAsync();
                
                // Commit transaction to finalize updates
                await tx.CommitAsync();
                
                // NOTICE: Save success - Transaction committed. Order and Tracking synchronized.
            }
            catch(Exception ex)
            {
                // Revert all changes in case of failure to maintain data integrity
                await tx.RollbackAsync();
                
                // NOTICE: Save failed - Transaction rolled back due to internal error
                throw new Exception($"Error updating order {orderId}", ex);
            }
        }

        //======================================================================
        // DATA MAPPING LAYER (Private Helper Methods)
        //======================================================================
        
        /// <summary>
        /// Transforms Order entity into a comprehensive OrderTrackingResponse DTO
        /// </summary>
        private OrderTrackingResponse MapTrackingResponse(Order order)
        {
            var latestTracking = order.OrderTrackings
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefault();

            return new OrderTrackingResponse
            {
                OrderId = order.OrderId,
                CurrentStatus = order.Status,
                CurrentLocation = order.ShippingDetail?.CurrentLocation,
                EstimatedDeliveryDate = order.EstimatedDeliveryDate,
                OrderDate = order.Create_At,
                Shipping = MapShipping(order),
                Timeline = MapTimeLine(order.OrderTrackings, latestTracking),
                OrderSummary = MapSummary(order)
            };
        }
        
        /// <summary>
        /// Maps shipping-specific details from the Order entity
        /// </summary>
        private ShippingInfoDto? MapShipping(Order order)
        {
            if(order.ShippingDetail == null) return null;

            return new ShippingInfoDto
            {
                Carrier = order.ShippingDetail.Carrier,
                TrackingCode = order.ShippingDetail.TrackingCode,
                ShipperId = order.ShippingDetail.ShipperId,
                CurrentLocation = order.ShippingDetail.CurrentLocation,
                EstimatedDeliveryDate = order.ShippingDetail.EstimatedDeliveryDate
            };
        }
        
        /// <summary>
        /// Constructs a chronological timeline of tracking events
        /// </summary>
        private List<TrackingEventDto> 
            MapTimeLine(IEnumerable<OrderTracking> trackings, OrderTracking? latestTracking)
        {
            return trackings
                .OrderBy(x => x.CreatedAt)
                .Select(t => new TrackingEventDto
                {
                    Id = t.OrderTrackingId,
                    Status = t.Status,
                    StatusLabel =  t.Status,
                    Location = t.Location,
                    Description = t.Description,
                    Timestamp =  t.CreatedAt,
                    UpdatedBy = t.UpdatedBy,
                    IsCompleted = true,
                    IsCurrent = latestTracking != null 
                                && t.OrderTrackingId == latestTracking.OrderTrackingId
                }).ToList();
        }
        
        /// <summary>
        /// Summarizes financial data and itemized list for the order
        /// </summary>
        private OrderSummaryDto? MapSummary(Order order)
        {
            return new OrderSummaryDto
            {
                OrderId = order.OrderId,
                MerchandiseSubtotal = order.MerchandiseSubtotal,
                ShippingFee = order.ShippingFee,
                DiscountAmount = order.DiscountAmount,
                FinalAmount = order.FinalAmount,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                Items = order.OrderItems
                    .Select(i => new OrderItemSummaryDto
                {
                    ProductName = i.ProductName,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            };
        }
        
        /// <summary>
        /// Projects Order entity to a lightweight DTO for user order history listing
        /// </summary>
        private MyOrderDto MapMyOrder(Order o)
        {
            return new MyOrderDto
            {
                OrderId = o.OrderId,
                Status = o.Status,
                StatusLabel = o.Status,
                FinalAmount = o.FinalAmount,
                ItemCount = o.OrderItems.Count,
                FirstItemName = o.OrderItems.FirstOrDefault()?.ProductName,
                OrderDate = o.Create_At,
                EstimatedDeliveryDate = o.EstimatedDeliveryDate
            };
        }
    }
}