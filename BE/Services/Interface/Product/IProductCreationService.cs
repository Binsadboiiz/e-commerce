using BE.Models.DTOs;

namespace BE.Services.Interface.Product;

public interface IProductCreationService
{
    Task<ProductResponse> CreateProductAsync(string sellerUserId, CreateProductRequest request);
}
