using BE.Models.DTOs;

namespace BE.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<ProductListDto>> GetAllAsync();

        Task<ProductListDto?> GetByIdAsync(long id);

        Task<List<ProductListDto>> SearchAsync(string keyword);
    }
}