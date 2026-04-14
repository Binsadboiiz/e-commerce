using BE.Repositories.Interfaces;
using BE.Services.Interface;
using BE.Models.DTOs;

namespace BE.Services.Implementation
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductListDto>> GetAllAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<ProductListDto> GetByIdAsync(long id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<ProductListDto>> SearchAsync(string keyword)
        {
            return await _productRepository.SearchAsync(keyword);
        }
    }
}