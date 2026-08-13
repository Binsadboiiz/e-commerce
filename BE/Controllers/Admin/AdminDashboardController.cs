using BE.Constants;
using BE.Helpers;
using BE.Models.DTOs;
using BE.Services.Interface.Admin;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = RoleConstants.Admin)]
    [Route("api/admin/dashboard")]

    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _adminDashboardService;

        public AdminDashboardController(IAdminDashboardService adminDashboardService)
        {
            _adminDashboardService = adminDashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = UserClaimsHelper.GetUserId(User);

            var result = await _adminDashboardService.GetDashboardAsync(userId);

            return Ok(result);
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _adminDashboardService.GetOverviewAsync();

            return Ok(result);
        }

        [HttpGet("seller-applications")]
        public async Task<IActionResult> GetSellerApplications()
        {
            var result = await _adminDashboardService.GetSellerApplicationsAsync();
            return Ok(result);
        }

        [HttpGet("seller-applications/{id}")]
        public async Task<IActionResult> GetSellerApplicationDetail(string id)
        {
            var result = await _adminDashboardService.GetSellerApplicationDetailAsync(id);
            if (result == null) return NotFound(new { message = "Seller application not found." });
            return Ok(result);
        }

        [HttpPost("seller-applications/{id}/approve")]
        public async Task<IActionResult> ApproveSellerApplication(string id)
        {
            var success = await _adminDashboardService.ApproveSellerApplicationAsync(id);
            if (!success) return BadRequest("Could not approve application or application not found.");
            return Ok(new { message = "Approved successfully." });
        }

        [HttpPost("seller-applications/{id}/reject")]
        public async Task<IActionResult> RejectSellerApplication(string id)
        {
            var success = await _adminDashboardService.RejectSellerApplicationAsync(id);
            if (!success) return BadRequest("Could not reject application or application not found.");
            return Ok(new { message = "Rejected successfully." });
        }
    }
}
