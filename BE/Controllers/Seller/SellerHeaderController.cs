using BE.Models.DTOs;
using BE.Models.DTOs.Seller;
using BE.Services.Interface.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace BE.Controllers.Seller
{
    /// <summary>
    /// Provides seller header information.
    /// Secured with user authentication and GeneralPolicy Rate Limiting.
    /// </summary>
    [ApiController]
    [Authorize]
    [EnableRateLimiting("GeneralPolicy")]
    [Route("api/seller/header")]
    public class SellerHeaderController : ControllerBase
    {
        private readonly ISellerHeaderService _headerService;

        public SellerHeaderController(
            ISellerHeaderService headerService)
        {
            _headerService = headerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHeader()
        {
            string userId = GetUserId();

            var result = await _headerService.GetHeaderAsync(userId);

            return Ok(ApiResponse<SellerHeaderDto>.SuccessResponse(result));
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }
    }
}