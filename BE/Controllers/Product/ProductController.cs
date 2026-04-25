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
            return Ok(result);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] ProductFilterDto filter)
        {
            var (items, total) = await _productQueryService.FilterAsync(filter);

            return Ok(new
            {
                items,
                total,
                page = filter.Page,
                pageSize = filter.PageSize,
                totalPages = (int)Math.Ceiling(total / (double)filter.PageSize)
            });
        }

        [HttpGet("filter/meta")]
        public async Task<IActionResult> GetMeta([FromQuery] ProductFilterDto filter)
        {
            var result = await _productQueryService.GetFilterMetaAsync(filter);
            return Ok(result);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _productQueryService.GetProductDetailBySlugAsync(slug);

            if (product == null)
                return NotFound();

            return Ok(product);
        }
    }
}
