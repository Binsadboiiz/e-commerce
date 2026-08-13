using System.Threading.Tasks;
using BE.Helpers;
using BE.Models.DTOs;
using BE.Models.DTOs.Seller.Dashboard;
using BE.Services.Interface.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Seller
{
    /// <summary>
    /// API Controller exposing endpoints for retrieving seller dashboard statistics.
    /// Access is restricted to authenticated users in the Seller role.
    /// </summary>
    [Authorize(Roles = "Seller,SELLER,seller")]
    [ApiController]
    [Route("api/seller/dashboard")]
    public class SellerDashboardController : ControllerBase
    {
        private readonly ISellerDashboardService _dashboardService;

        /// <summary>
        /// Constructor injecting the ISellerDashboardService.
        /// </summary>
        /// <param name="dashboardService">Service instance to handle business logic.</param>
        public SellerDashboardController(ISellerDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Retrieves compiled seller dashboard metrics, trends, category distributions, and recent orders.
        /// GET /api/seller/dashboard?timeRange=7d
        /// </summary>
        /// <param name="timeRange">Optional period filter (today, 7d, 30d, ytd). Defaults to 7d.</param>
        /// <returns>HTTP OK (200) containing the serialized dashboard DTO wrapped in ApiResponse.</returns>
        [HttpGet]
        public async Task<IActionResult> GetDashboardData([FromQuery] string timeRange = "7d")
        {
            // Retrieve user identity ID from claims using UserClaimsHelper
            string userId = UserClaimsHelper.GetUserId(User);

            // Fetch compiled dashboard information from the service layer
            var data = await _dashboardService.GetDashboardDataAsync(userId, timeRange);

            // Return wrapped successful response
            return Ok(ApiResponse<SellerDashboardDto>.SuccessResponse(data));
        }
    }
}
