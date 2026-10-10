using System.Threading.Tasks;
using BE.Helpers;
using BE.Models.DTOs;
using BE.Models.DTOs.Seller;
using BE.Services.Interface.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Seller
{
    /// <summary>
    /// Controller for seller store management operations (view, update, and initial onboarding setup).
    /// Secured with Seller role authorization and GeneralPolicy Rate Limiting.
    /// </summary>
    [Authorize(Roles = "Seller,SELLER,seller,Customer,CUSTOMER,customer")]
    [EnableRateLimiting("GeneralPolicy")]
    [ApiController]
    [Route("api/seller/store")]
    public class SellerStoreController : ControllerBase
    {
        private readonly IStoreService _storeService;

        public SellerStoreController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        /// <summary>
        /// Checks if seller has initialized a shop and returns pre-filled onboarding details.
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetShopStatus()
        {
            string userId = UserClaimsHelper.GetUserId(User);
            var result = await _storeService.GetShopStatusAsync(userId);
            return Ok(ApiResponse<SellerShopStatusDto>.SuccessResponse(result));
        }

        /// <summary>
        /// Creates initial Shop record during seller first-time onboarding.
        /// </summary>
        [HttpPost("setup")]
        public async Task<IActionResult> SetupShop([FromBody] SetupShopRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed for request payload."));
            }

            string userId = UserClaimsHelper.GetUserId(User);
            var result = await _storeService.SetupShopAsync(userId, request);
            return Ok(ApiResponse<StoreDetailResponse>.SuccessResponse(result, "Cửa hàng đã được mở thành công!"));
        }

        /// <summary>
        /// Retrieves the store profile details for the currently authenticated seller.
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetStoreProfile()
        {
            string userId = UserClaimsHelper.GetUserId(User);

            var result = await _storeService.GetMyStoreProfileAsync(userId);

            return Ok(ApiResponse<StoreDetailResponse>.SuccessResponse(result));
        }

        /// <summary>
        /// Updates the store profile details for the currently authenticated seller.
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateStoreProfile([FromBody] UpdateStoreRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed for the request payload."));
            }

            string userId = UserClaimsHelper.GetUserId(User);

            var result = await _storeService.UpdateMyStoreProfileAsync(userId, request);

            return Ok(ApiResponse<StoreDetailResponse>.SuccessResponse(result, "Store profile updated successfully."));
        }
    }
}
