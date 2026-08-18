using System.Threading.Tasks;
using BE.Middlewares;
using BE.Models.DTOs.Seller;
using BE.Repositories.Interfaces.Seller;
using BE.Services.Interface.Seller;

namespace BE.Services.Implementation.Seller
{
    /// <summary>
    /// Service implementation for managing seller store profiles.
    /// Encapsulates business validation and coordinates with the store repository.
    /// </summary>
    public class StoreService : IStoreService
    {
        private readonly IStoreRepository _storeRepository;

        public StoreService(IStoreRepository storeRepository)
        {
            _storeRepository = storeRepository;
        }

        /// <inheritdoc />
        public async Task<StoreDetailResponse> GetMyStoreProfileAsync(string userId)
        {
            var store = await _storeRepository.GetByOwnerIdAsync(userId);

            if (store == null)
            {
                throw new AppException("Store not found for the current seller.", 404);
            }

            return store;
        }

        /// <inheritdoc />
        public async Task<StoreDetailResponse> UpdateMyStoreProfileAsync(string userId, UpdateStoreRequest request)
        {
            var store = await _storeRepository.GetByOwnerIdAsync(userId);

            if (store == null)
            {
                throw new AppException("Store not found for the current seller.", 404);
            }

            var updated = await _storeRepository.UpdateAsync(store.ShopId, request);

            if (!updated)
            {
                throw new AppException("Failed to update store profile.", 500);
            }

            // Fetch and return the updated store profile payload
            var updatedStore = await _storeRepository.GetByOwnerIdAsync(userId);
            return updatedStore ?? store;
        }
    }
}
