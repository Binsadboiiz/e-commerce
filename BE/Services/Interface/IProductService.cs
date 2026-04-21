using BE.Models.DTOs;

namespace BE.Services.Interface
{
    public interface IProductService
    {
        Task<ProductListDto?> GetByIdAsync(long id);
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

        Task<(IEnumerable<ProductListDto> items, int total)> FilterAsync(ProductFilterDto filter);

    }
}