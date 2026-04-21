using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductListDto>> GetAllAsync();
        Task<ProductListDto?> GetByIdAsync(long id);
        Task<IEnumerable<ProductListDto>> SearchAsync(string keyword);
        
        // CRUD product

        Task<ProductResponse> CreateProductAsync(
            string retailerUserId,
            CreateProductRequest request);

        Task<ProductResponse> UpdateProductAsync(
            long productId,
            string retailerUserId,
            UpdateProductRequest request);
        
        Task DeleteProductAsync(
            long productId,
            string retailerUserId);
    }
}
