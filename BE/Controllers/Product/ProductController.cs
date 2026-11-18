using BE.Models.DTOs;
using BE.Models.DTOs.Products.ProductDetail;
using BE.Models.DTOs.Products.ProductFilter;
using BE.Models.DTOs.Search;
using BE.Services.Interface.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Product
{
    /// <summary>
    /// Exposes read-only product catalog endpoints.
    /// Protected by GeneralPolicy rate limiting to prevent scraping and API abuse.
    /// </summary>
    [EnableRateLimiting("GeneralPolicy")]
    [ApiController]
    [Route("api/products")]
    [AllowAnonymous]
    public class ProductController : ControllerBase
    {
        private readonly IProductQueryService _productQueryService;
        private readonly ISearchSuggestionService _searchSuggestionService;

        public ProductController(
            IProductQueryService productQueryService,
            ISearchSuggestionService searchSuggestionService)
        {
            _productQueryService = productQueryService;
            _searchSuggestionService = searchSuggestionService;
        }

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions([FromQuery] string? q, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 1)
            {
                return Ok(ApiResponse<SearchSuggestionDto>.SuccessResponse(new SearchSuggestionDto()));
            }

            var result = await _searchSuggestionService.GetSearchSuggestionAsync(q, cancellationToken);
            return Ok(ApiResponse<SearchSuggestionDto>.SuccessResponse(result));
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
