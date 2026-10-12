using BE.Models.DTOs.User;

namespace BE.Services.Interface
{
    public interface IUserAddressService
    {
        Task<List<UserAddressDto>> GetMyAddressesAsync(string userId);
        Task<UserAddressDto> CreateAddressAsync(string userId, CreateUserAddressRequest request);
        Task<UserAddressDto> UpdateAddressAsync(string userId, long id, UpdateUserAddressRequest request);
        Task<bool> DeleteAddressAsync(string userId, long id);
        Task<bool> SetDefaultAddressAsync(string userId, long id);
    }
}
