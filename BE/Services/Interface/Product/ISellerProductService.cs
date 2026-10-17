using BE.Models.DTOs;
using BE.Models.DTOs.Products.ProductDetail;

namespace BE.Services.Interface.Product;

public interface ISellerProductService
{
    Task<ProductDetailDto?> GetSellerProductByIdAsync(long productId, string sellerUserId);
    Task DeleteProductAsync(long productId, string sellerUserId);
    Task<(IEnumerable<ProductListDto> items, int total)> GetProductsBySellerAsync(
        string sellerUserId,
        int page,
        int pageSize,
        string? search,
        string? status,
        string? sortBy);
}
