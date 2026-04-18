using BE.Repositories.Interfaces;
using BE.Services.Interface;
using BE.Models.DTOs;
using BE.Models.Entities;

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
            var products = await _productRepository.GetAllAsync();

            return products.Select(MapToDto);
        }

        public async Task<ProductListDto?> GetByIdAsync(long id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null) return null;

            return MapToDto(product);
        }

        public async Task<IEnumerable<ProductListDto>> SearchAsync(string keyword)
        {
            var products = await _productRepository.SearchAsync(keyword);

            return products.Select(MapToDto);
        }

        private ProductListDto MapToDto(Product p)
        {
            return new ProductListDto
            {
                Id = p.ProductId,
                Name = p.Name,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                Stock = p.Stock,
                ImageUrl = p.Image,
                RatingAvg = p.RatingAvg,
                CategoryName = p.Category?.Type,
                BrandName = p.Brand?.Name
            };
        }
    }
}