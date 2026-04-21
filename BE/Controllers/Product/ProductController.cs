using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Product
{
    [ApiController]
    [Route("api/products")]
    [AllowAnonymous]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductListDto>>> GetAll()
        {
            var result = await _productService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<ProductListDto>> GetById(long id)
        {
            var result = await _productService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] ProductFilterDto filter)
        {
            var (items, total) = await _productService.FilterAsync(filter);

            return Ok(new
            {
                items,
                total,
                page = filter.Page,
                pageSize = filter.PageSize
            });
        }
    }
}
