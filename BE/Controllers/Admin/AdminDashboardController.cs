using System.Threading.Tasks;
using BE.Constants;
using BE.Helpers;
using BE.Services.Interface.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Admin
{
    /// <summary>
    /// Controller for core system administration overview and dashboard metrics.
    /// Rate limited using GeneralPolicy and protected by Admin role authorization.
    /// </summary>
    [ApiController]
    [Authorize(Roles = RoleConstants.Admin)]
    [EnableRateLimiting("GeneralPolicy")]
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
    }
}
