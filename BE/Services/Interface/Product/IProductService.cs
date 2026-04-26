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

        /// <summary>
        /// Lấy danh sách sản phẩm của retailer (bao gồm cả deleted).
        /// Chỉ trả về products thuộc shop mà retailer sở hữu.
        /// </summary>
        Task<(IEnumerable<ProductListDto> items, int total)> GetProductsByRetailerAsync(
            string retailerUserId,
            int page,
            int pageSize,
            string? search,
            string? status,
            string? sortBy);
    }
}