using System.Threading.Tasks;
using BE.Models.DTOs.Seller;

namespace BE.Repositories.Interfaces.Seller
{
    /// <summary>
    /// Repository interface for store profile data access operations.
    /// </summary>
    public interface IStoreRepository
    {
        /// <summary>
        /// Retrieves store details by shop ID.
        /// </summary>
        Task<StoreDetailResponse?> GetByShopIdAsync(long shopId);

        /// <summary>
        /// Retrieves store details by owner user ID.
        /// </summary>
        Task<StoreDetailResponse?> GetByOwnerIdAsync(string ownerId);

        /// <summary>
        /// Checks whether a given owner user ID owns the specified shop.
        /// </summary>
        Task<bool> IsOwnerAsync(long shopId, string ownerId);

        /// <summary>
        /// Updates shop basic info and store detail record for a shop (with automatic creation if detail row missing).
        /// </summary>
        Task<bool> UpdateAsync(long shopId, UpdateStoreRequest request);

        /// <summary>
        /// Checks if a shop exists by shop ID.
        /// </summary>
        Task<bool> ExistsAsync(long shopId);
    }
}
