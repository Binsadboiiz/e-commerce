using BE.Models.Entities;

namespace BE.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(long id);
        Task<List<Product>> SearchAsync(string keyword);
    }
}