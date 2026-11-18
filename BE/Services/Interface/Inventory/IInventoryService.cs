using BE.Models.DTOs;

namespace BE.Services.Interface.Inventory
{
    public interface IInventoryService
    {
        Task<int> GetAvailableStockAsync(long productId, long variantId);
        Task DeductStockAsync(IEnumerable<InventoryDeductionRequest> requests);
    }
}
