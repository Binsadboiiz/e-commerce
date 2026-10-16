using System.Threading.Tasks;
using BE.Constants;
using BE.Helpers;
using BE.Models.DTOs.Admin.Dashboard;
using BE.Services.Interface.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Admin
{
    /// <summary>
    /// Controller dedicated to managing seller onboarding applications.
    /// Handles listing, detail retrieval, review progression, approvals, and rejections.
    /// </summary>
    [ApiController]
    [Authorize(Roles = RoleConstants.Admin)]
    [EnableRateLimiting("GeneralPolicy")]
    [Route("api/admin/seller-applications")]
    [Route("api/admin/dashboard/seller-applications")]
    public class AdminSellerApplicationController : ControllerBase
    {
        private readonly IAdminSellerApplicationService _sellerApplicationService;

        public AdminSellerApplicationController(IAdminSellerApplicationService sellerApplicationService)
        {
            _sellerApplicationService = sellerApplicationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSellerApplications()
        {
            var result = await _sellerApplicationService.GetSellerApplicationsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSellerApplicationDetail(string id)
        {
            var result = await _sellerApplicationService.GetSellerApplicationDetailAsync(id);
            if (result == null)
                return NotFound(new { message = "Seller application not found." });
            return Ok(result);
        }

        [HttpPost("{id}/under-review")]
        public async Task<IActionResult> StartReviewSellerApplication(string id)
        {
            var adminUserId = UserClaimsHelper.GetUserId(User);

            if (string.IsNullOrEmpty(adminUserId))
                return BadRequest("User not found.");

            var success = await _sellerApplicationService.StartReviewSellerApplicationAsync(id, adminUserId);

            if (!success)
                return BadRequest("Could not start reviewing seller application.");

            return Ok(new
            {
                message = "Seller application is now under review."
            });
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveSellerApplication(string id)
        {
            var success = await _sellerApplicationService.ApproveSellerApplicationAsync(id);
            if (!success)
                return BadRequest("Could not approve application or application not found.");
            return Ok(new
            {
                message = "Approved successfully."
            });
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectSellerApplication(string id, [FromBody] RejectSellerApplicationRequest? request)
        {
            var success = await _sellerApplicationService.RejectSellerApplicationAsync(id, request?.Reason);
            if (!success)
                return BadRequest("Could not reject application or application not found.");
            return Ok(new
            {
                message = "Rejected successfully."
            });
        }
    }
}
