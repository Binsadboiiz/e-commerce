using BE.Models.Entities;

namespace BE.Repositories.Interfaces.Products
{
    public interface IProductRepository
    {
        IQueryable<Product> Query();

        Task<Product?> GetByIdAsync(long id);

        Task<Product?> GetBySlugAsync(string slug);


    }
}
