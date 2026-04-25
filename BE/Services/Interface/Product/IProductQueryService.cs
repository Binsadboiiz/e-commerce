using BE.Models.DTOs;
using BE.Models.DTOs.Products.ProductDetail;
using BE.Models.DTOs.Products.ProductFilter;

namespace BE.Services.Interface.Product
{
    /// <summary>
    /// Defines product read models, search and filtering operations.
    /// </summary>
    
    public interface IProductQueryService
    {
        Task<ProductListDto?> GetByIdAsync(long id);

        Task<(IEnumerable<ProductListDto> items, int total)> FilterAsync(ProductFilterDto filter);

        Task<ProductFilterMetaDto> GetFilterMetaAsync(ProductFilterDto filter);

        //Product Detail
        Task<ProductDetailDto?> GetProductDetailBySlugAsync(string slug);

    }
}
