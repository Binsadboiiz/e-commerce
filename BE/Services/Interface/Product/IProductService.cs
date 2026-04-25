using BE.Models.DTOs;

namespace BE.Services.Interface.Product
{

    /// <summary>
    /// Defines product management operations and write-side workflows.
    /// </summary>
    /// 
    public interface IProductService
    {
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