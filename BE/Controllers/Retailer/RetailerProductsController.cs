using System.Threading.Tasks;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using BE.Validators;

namespace BE.Controllers.Retailer
{
    [ApiController]
    [Route("api/retailer/products")]
    public class RetailerProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public RetailerProductsController(IProductService productService)
        {
            _productService = productService;
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateProduct(
            CreateProductRequest request)
        {
            var validator = new CreateProductValidator();

            var errors = validator.Validate(request);

            if (errors.Any())
            {
                return BadRequest(new
                {
                    Errors = errors
                });
            }
            string userId = GetCurrentUserId();

            var result = await _productService
                .CreateProductAsync(userId, request);

            return Ok(result);
        }
        
        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateProduct(
            long productId,
            UpdateProductRequest request)
        {
            string userId = GetCurrentUserId();

            var result = await _productService
                .UpdateProductAsync(
                    productId,
                    userId,
                    request);

            return Ok(result);
        }
        
        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteProduct(
            long productId)
        {
            string userId = GetCurrentUserId();

            await _productService.DeleteProductAsync(
                productId,
                userId);

            return NoContent();
        }
        
        
        // sau này làm token session sẽ chỉnh lại
        private string GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("sub");

            if (userIdClaim == null)
                throw new UnauthorizedAccessException();

            return userIdClaim.Value;
        }
    }
}