using BE.Models.DTOs;
using BE.Models.DTOs.Products.ProductDetail;
using BE.Models.DTOs.Products.ProductFilter;
using BE.Services.Interface.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Product
{
    /// <summary>
    /// Exposes read-only product catalog endpoints.
    /// </summary>
   
    [ApiController]
    [Route("api/products")]
    [AllowAnonymous]
    public class ProductController : ControllerBase
    {
        private readonly IProductQueryService _productQueryService;

        public ProductController(IProductQueryService productQueryService)
        {
            _productQueryService = productQueryService;
        }

        [HttpGet("by-id/{id:long}")]
        public async Task<ActionResult<ProductListDto>> GetById(long id)
        {
            var result = await _productQueryService.GetByIdAsync(id);
            return Ok(ApiResponse<ProductListDto>.SuccessResponse(result));
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] ProductFilterDto filter)
        {
            var (items, total) = await _productQueryService.FilterAsync(filter);

            var data = new
            {
                items,
                total,
                page = filter.Page,
                pageSize = filter.PageSize,
                totalPages = (int)Math.Ceiling(total / (double)filter.PageSize)
            };

            return Ok(ApiResponse<object>.SuccessResponse(data));
        }

        [HttpGet("filter/meta")]
        public async Task<IActionResult> GetMeta([FromQuery] ProductFilterDto filter)
        {
            var result = await _productQueryService.GetFilterMetaAsync(filter);
            return Ok(ApiResponse<ProductFilterMetaDto>.SuccessResponse(result));
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _productQueryService.GetProductDetailBySlugAsync(slug);

            if (product == null)
                return NotFound(ApiResponse.FailureResponse("Product not found."));

            return Ok(ApiResponse<ProductDetailDto>.SuccessResponse(product));
        }
    }
}
