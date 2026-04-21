using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IProductService
    {
        Task<(IEnumerable<ProductListDto> items, int total)> FilterAsync(ProductFilterDto filter);
        Task<ProductListDto?> GetByIdAsync(long id);
    }
}