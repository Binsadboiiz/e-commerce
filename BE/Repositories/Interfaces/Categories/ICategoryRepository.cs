using BE.Models.Entities;

namespace BE.Repositories.Interfaces.Categories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
    }
}
