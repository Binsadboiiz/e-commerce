using System.Threading.Tasks;
using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Seller
{
    /// <summary>
    /// Service interface for seller store profile management business logic.
    /// </summary>
    public interface IStoreService
    {
        /// <summary>
        /// Retrieves store profile details for the currently authenticated seller.
        /// </summary>
        /// <param name="userId">The unique identifier of the seller user.</param>
        /// <returns>Store detail response payload.</returns>
        Task<StoreDetailResponse> GetMyStoreProfileAsync(string userId);

        /// <summary>
        /// Updates store profile details for the currently authenticated seller.
        /// </summary>
        /// <param name="userId">The unique identifier of the seller user.</param>
        /// <param name="request">The payload containing updated store information.</param>
        /// <returns>Updated store detail response payload.</returns>
        Task<StoreDetailResponse> UpdateMyStoreProfileAsync(string userId, UpdateStoreRequest request);
    }
}
