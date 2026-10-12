using BE.Helpers;
using BE.Models.DTOs;
using BE.Models.DTOs.User;
using BE.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.User
{
    [Authorize]
    [EnableRateLimiting("GeneralPolicy")]
    [ApiController]
    [Route("api/user/addresses")]
    public class UserAddressController : ControllerBase
    {
        private readonly IUserAddressService _userAddressService;

        public UserAddressController(IUserAddressService userAddressService)
        {
            _userAddressService = userAddressService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var result = await _userAddressService.GetMyAddressesAsync(userId);
            return Ok(ApiResponse<List<UserAddressDto>>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddress([FromBody] CreateUserAddressRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid address data."));
            }

            var userId = UserClaimsHelper.GetUserId(User);
            var result = await _userAddressService.CreateAddressAsync(userId, request);
            return Ok(ApiResponse<UserAddressDto>.SuccessResponse(result, "New address added successfully."));
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateAddress(long id, [FromBody] UpdateUserAddressRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid address data."));
            }

            var userId = UserClaimsHelper.GetUserId(User);
            var result = await _userAddressService.UpdateAddressAsync(userId, id, request);
            return Ok(ApiResponse<UserAddressDto>.SuccessResponse(result, "Address updated successfully."));
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteAddress(long id)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            await _userAddressService.DeleteAddressAsync(userId, id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Address deleted successfully."));
        }

        [HttpPut("{id:long}/default")]
        public async Task<IActionResult> SetDefaultAddress(long id)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            await _userAddressService.SetDefaultAddressAsync(userId, id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Set as the default address."));
        }
    }
}
