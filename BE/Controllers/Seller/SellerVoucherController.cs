using BE.Helpers;
using BE.Models.DTOs;
using BE.Models.DTOs.Seller;
using BE.Services.Interface.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Seller
{
    [Authorize(Roles = "Seller,SELLER,seller")]
    [ApiController]
    [Route("api/seller/vouchers")]
    public class SellerVoucherController : ControllerBase
    {
        private readonly ISellerVoucherService _voucherService;

        public SellerVoucherController(ISellerVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyVouchers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var (items, total) = await _voucherService.GetVouchersBySellerAsync(userId, page, pageSize, search);

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

        [HttpPost]
        public async Task<IActionResult> CreateVoucher([FromBody] CreateVoucherRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));
            }

            var userId = UserClaimsHelper.GetUserId(User);
            var result = await _voucherService.CreateVoucherAsync(userId, request);

            return Ok(ApiResponse<VoucherDto>.SuccessResponse(result, "Voucher created successfully."));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateVoucher(long id, [FromBody] UpdateVoucherRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));
            }

            var userId = UserClaimsHelper.GetUserId(User);
            var result = await _voucherService.UpdateVoucherAsync(id, userId, request);

            return Ok(ApiResponse<VoucherDto>.SuccessResponse(result, "Voucher updated successfully."));
        }

        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> DeleteVoucher(long id)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            await _voucherService.DeleteVoucherAsync(id, userId);

            return Ok(ApiResponse.SuccessResponse("Voucher deleted or deactivated successfully."));
        }
    }
}
