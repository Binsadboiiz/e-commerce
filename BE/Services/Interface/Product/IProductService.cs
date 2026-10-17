using BE.Models.DTOs;
using BE.Models.DTOs.Products.ProductDetail;

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
            string sellerUserId,
            CreateProductRequest request);

        Task<ProductResponse> UpdateProductAsync(
            long productId,
            string sellerUserId,
            UpdateProductRequest request);

        Task<ProductDetailDto?> GetSellerProductByIdAsync(
            long productId,
            string sellerUserId);

        Task DeleteProductAsync(
            long productId,
            string sellerUserId);

        /// <summary>
        /// Lấy danh sách sản phẩm của seller (bao gồm cả deleted).
        /// Chỉ trả về products thuộc shop mà seller sở hữu.
        /// </summary>
        Task<(IEnumerable<ProductListDto> items, int total)> GetProductsBySellerAsync(
            string sellerUserId,
            int page,
            int pageSize,
            string? search,
            string? status,
            string? sortBy);
    }
}