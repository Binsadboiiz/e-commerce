using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductListDto>> GetAllAsync();
        Task<ProductListDto> GetByIdAsync(long id);
        Task<IEnumerable<ProductListDto>> SearchAsync(string keyword);
    }
}
