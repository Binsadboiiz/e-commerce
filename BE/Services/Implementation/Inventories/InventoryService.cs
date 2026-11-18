using BE.Constants;
using BE.Data;
using BE.Middlewares;
using BE.Models.DTOs;
using BE.Services.Interface.Inventory;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Inventories
{
    public class InventoryService : IInventoryService
    {
        private readonly ApplicationDbContext _context;

        public InventoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetAvailableStockAsync(long productId, long variantId)
        {
            if (productId <= 0 || variantId <= 0)
            {
                throw new AppException("Product and variant are required.");
            }

            var availableStock = await _context.Inventories
                .AsNoTracking()
                .Where(inventory =>
                    inventory.ProductVariantId == variantId &&
                    inventory.ProductVariant.ProductId == productId)
                .Select(inventory => (int?)(inventory.AvailableStock - inventory.ReservedStock))
                .SingleOrDefaultAsync();

            if (!availableStock.HasValue)
            {
                throw new AppException("Invalid variant or inventory not found.");
            }

            return availableStock.Value;
        }

        public async Task DeductStockAsync(IEnumerable<InventoryDeductionRequest> requests)
        {
            ArgumentNullException.ThrowIfNull(requests);

            var requestList = requests.ToList();
            if (requestList.Count == 0)
            {
                return;
            }

            if (requestList.Any(request => request.VariantId <= 0 || request.Quantity <= 0))
            {
                throw new AppException("Inventory variant and quantity must be greater than zero.");
            }

            var groupedRequests = requestList
                .GroupBy(request => request.VariantId)
                .Select(group => new
                {
                    VariantId = group.Key,
                    Quantity = group.Sum(request => (long)request.Quantity)
                })
                .OrderBy(request => request.VariantId)
                .ToList();

            if (groupedRequests.Any(request => request.Quantity > int.MaxValue))
            {
                throw new AppException("Requested inventory quantity is too large.");
            }

            var variantIds = groupedRequests.Select(request => request.VariantId).ToList();
            var productIdsByVariant = await _context.ProductVariants
                .AsNoTracking()
                .Where(variant => variantIds.Contains(variant.VariantId))
                .Select(variant => new { variant.VariantId, variant.ProductId })
                .ToDictionaryAsync(variant => variant.VariantId, variant => variant.ProductId);

            if (productIdsByVariant.Count != variantIds.Count)
            {
                throw new AppException("One or more product variants no longer exist.", 409);
            }

            foreach (var request in groupedRequests)
            {
                var quantity = (int)request.Quantity;
                var now = DateTime.UtcNow;

                var affectedRows = await _context.Inventories
                    .Where(inventory =>
                        inventory.ProductVariantId == request.VariantId &&
                        inventory.AvailableStock - inventory.ReservedStock >= quantity)
                    .ExecuteUpdateAsync(update => update
                        .SetProperty(
                            inventory => inventory.AvailableStock,
                            inventory => inventory.AvailableStock - quantity)
                        .SetProperty(
                            inventory => inventory.SoldStock,
                            inventory => inventory.SoldStock + quantity)
                        .SetProperty(inventory => inventory.UpdatedAt, now));

                if (affectedRows != 1)
                {
                    throw new AppException(
                        $"Insufficient stock or inventory not found for variant {request.VariantId}.",
                        409);
                }
            }

            foreach (var productId in productIdsByVariant.Values.Distinct())
            {
                var totalAvailableStock = await _context.Inventories
                    .Where(inventory => inventory.ProductVariant.ProductId == productId)
                    .Select(inventory => inventory.AvailableStock - inventory.ReservedStock)
                    .SumAsync();

                var productQuery = _context.Products
                    .Where(product => product.ProductId == productId);
                var now = DateTime.UtcNow;

                if (totalAvailableStock <= 0)
                {
                    await productQuery
                        .Where(product => product.Status != ProductConstants.ProductStatusOutOfStock)
                        .ExecuteUpdateAsync(update => update
                            .SetProperty(
                                product => product.Status,
                                ProductConstants.ProductStatusOutOfStock)
                            .SetProperty(product => product.UpdatedAt, now));
                }
                else
                {
                    await productQuery
                        .Where(product => product.Status == ProductConstants.ProductStatusOutOfStock)
                        .ExecuteUpdateAsync(update => update
                            .SetProperty(
                                product => product.Status,
                                ProductConstants.ProductStatusActive)
                            .SetProperty(product => product.UpdatedAt, now));
                }
            }
        }
    }
}
