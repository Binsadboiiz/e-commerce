using System.Threading.Tasks;
using BE.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using BE.Validators;
using BE.Helpers;
using BE.Services.Interface.Product;
using Microsoft.AspNetCore.Authorization;

namespace BE.Controllers.Retailer
{
    [Authorize(Roles = "Retailer")]
    [ApiController]
    [Route("api/retailer/products")]
    public class RetailerProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public RetailerProductsController(IProductService productService)
        {
            _productService = productService;
        }
        
        /// <summary>
        /// Lấy danh sách sản phẩm của retailer hiện tại.
        /// Bao gồm cả sản phẩm đã soft-delete (FE xử lý hiển thị mờ).
        /// Hỗ trợ: search, filter status, sort, pagination.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? sortBy = null)
        {
            string userId = UserClaimsHelper.GetUserId(User);

            var (items, total) = await _productService
                .GetProductsByRetailerAsync(userId, page, pageSize, search, status, sortBy);

            var data = new
            {
                items,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)total / pageSize)
            };

            return Ok(ApiResponse<object>.SuccessResponse(data));
        }
        
        [HttpPost("")]
        public async Task<IActionResult> CreateProduct(
            CreateProductRequest request)
        {
            var validator = new CreateProductValidator();

            var errors = validator.Validate(request);

            if (errors.Any())
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));
            }
            string userId = UserClaimsHelper.GetUserId(User);

            var result = await _productService
                .CreateProductAsync(userId, request);

            return Ok(ApiResponse<ProductResponse>.SuccessResponse(result, "Product created successfully."));
        }
        
        [HttpPut("update/{productId}")]
        public async Task<IActionResult> UpdateProduct(
            long productId,
            UpdateProductRequest request)
        {
            string userId = UserClaimsHelper.GetUserId(User);

            var result = await _productService
                .UpdateProductAsync(
                    productId,
                    userId,
                    request);

            return Ok(ApiResponse<ProductResponse>.SuccessResponse(result, "Product updated successfully."));
        }
        
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> DeleteProduct(
            long productId)
        {
            string userId = UserClaimsHelper.GetUserId(User);

            await _productService.DeleteProductAsync(
                productId,
                userId);

            return Ok(ApiResponse.SuccessResponse("Product deleted successfully."));
        }
    }
}