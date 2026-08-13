using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Seller
{
    /// <summary>
    /// Handles seller registration workflow.
    /// </summary>
    public interface ISellerRegistrationService
    {
        Task<SellerRegistrationDto?> GetRegistrationAsync(string userId);

        Task CreateRegistrationAsync(string userId, CreateSellerRegistrationRequest request);

        Task UpdateRegistrationAsync(string userId, UpdateSellerRegistrationRequest request);

        Task SubmitRegistrationAsync(string userId);

        Task ChangeSellerTypeAsync(string userId, ChangeSellerTypeRequest request);
    }
}