using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Seller
{
    /// <summary>
    /// Provides seller information for application header.
    /// </summary>
    public interface ISellerHeaderService
    {
        Task<SellerHeaderDto> GetHeaderAsync(string userId);
    }
}