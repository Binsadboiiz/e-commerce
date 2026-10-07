using BE.Data;
using BE.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Brand
{
    /// <summary>
    /// Controller for retrieving product brand listings.
    /// Rate limited using GeneralPolicy.
    /// </summary>
    [EnableRateLimiting("GeneralPolicy")]
    [ApiController]
    [Route("api/brands")]
    [AllowAnonymous]
    public class BrandController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BrandController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await _context.Brands
                .AsNoTracking()
                .Select(b => new BrandDto
                {
                    BrandId = b.BrandId,
                    Name = b.Name
                })
                .ToListAsync();

            return Ok(ApiResponse<IEnumerable<BrandDto>>.SuccessResponse(brands));
        }
    }
}
