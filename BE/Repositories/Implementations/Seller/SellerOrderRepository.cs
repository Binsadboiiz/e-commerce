using BE.Data;
using BE.Models.Entities;
using BE.Repositories.Interfaces.Seller;
using Microsoft.EntityFrameworkCore;

namespace BE.Repositories.Implementations.Seller
{
    public class SellerOrderRepository : ISellerOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public SellerOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Implement the methods defined in the ISellerOrderRepository interface here

        public async Task<List<long>> GetSellerShopIdsAsync(string userId)
        {
            return await _context.Shops
                .Where(s => s.OwnerId == userId && s.IsActive)
                .Select(s => s.ShopId)
                .ToListAsync();
        }

        public async Task<List<Order>> GetOrdersAsync
            (List<long> shopIds, string? status, int page, int pageSize)
        {
            var query = _context.Orders
                .AsNoTracking()
                .Where(o => o.OrderItems.Any(item => shopIds.Contains(item.ShopId)));

            if(!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => 
                    o.OrderItems.Any(item => 
                    shopIds.Contains(item.ShopId) && 
                    item.SellerStatus == status));
            }
            return await query
                .Include(order => order.Customer)
                .Include(order => order.OrderItems)
                .ThenInclude(item => item.Product)
                .OrderByDescending(order => order.Create_At)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountOrdersAsync(List<long> shopIds, string? status)
        {
            var query = _context.Orders.Where(o => 
                o.OrderItems.Any(item => 
                shopIds.Contains(item.ShopId)));

            if(!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => 
                    o.OrderItems.Any(item => 
                    shopIds.Contains(item.ShopId) && 
                    item.SellerStatus == status));
            }

            return await query.CountAsync();
        }

        public async Task<Order?> GetOrderDetailAsync(long orderId, List<long> shopIds)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(order => order.Customer)
                .Include(order => order.OrderItems)
                    .ThenInclude(item => item.Product)
                .Include(order => order.OrderTrackings)
                .FirstOrDefaultAsync(order => order.OrderId == orderId &&
                    order.OrderItems.Any(item => shopIds.Contains(item.ShopId)));
        }

        public async Task<Order?> GetOrderForUpdateAsync(long orderId, List<long> shopIds)
        {
            return await _context.Orders
                .Include(order => order.OrderItems)
                .Include(order => order.OrderTrackings)
                .Include(order => order.ShippingDetail)
                .FirstOrDefaultAsync(order => order.OrderId == orderId &&
                    order.OrderItems.Any(item => shopIds.Contains(item.ShopId)));
        }

        public async Task<List<OrderItem>> GetSellerOrderItemsAsync(long orderId, List<long> shopIds)
        {
            return await _context.OrderItems
                .Where(item => item.OrderId == orderId && 
                    shopIds.Contains(item.ShopId))
                .Include(item => item.Product)
                .ToListAsync();
        }

        public async Task<List<OrderTracking>> GetOrderTrackingAsync(long orderId, List<long> shopIds)
        {
            return await _context.OrderTrackings
                .AsNoTracking()
                .Where(tracking => 
                    tracking.OrderId == orderId && 
                    tracking.ShopId.HasValue && 
                    shopIds.Contains(tracking.ShopId.Value))
                .OrderBy(tracking => tracking.CreatedAt)
                .ToListAsync();
        }

        public async Task AddTrackingAsync(OrderTracking tracking)
        {
            await _context.OrderTrackings.AddAsync(tracking);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}