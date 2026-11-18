using BE.Models.DTOs;

namespace BE.Services.Interface.Product;

public interface IProductUpdateService
{
    Task<ProductResponse> UpdateProductAsync(long productId, string sellerUserId, UpdateProductRequest request);
}
