using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Category
{
    /// <summary>
    /// Controller for retrieving product category listings.
    /// Rate limited using GeneralPolicy.
    /// </summary>
    [EnableRateLimiting("GeneralPolicy")]
    [ApiController]
    [Route("api/categories")]
    [AllowAnonymous]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var result = await _categoryService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<CategoryDto>>.SuccessResponse(result));
        }
    }
}
