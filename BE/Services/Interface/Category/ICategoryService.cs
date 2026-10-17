using BE.Models.DTOs;

namespace BE.Services.Interface.Category
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();
    }
}
