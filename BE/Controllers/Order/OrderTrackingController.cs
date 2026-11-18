using BE.Helpers;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Order
{
    /// <summary>
    /// Controller for customer order tracking and status updates.
    /// Secured with Authorize and GeneralPolicy Rate Limiting to prevent IDOR and unauthorized tracking access.
    /// </summary>
    [Authorize]
    [EnableRateLimiting("GeneralPolicy")]
    [Route("api/order-tracking")]
    [ApiController]
    public class OrderTrackingController : ControllerBase
    {
        private readonly IOrderTrackingService _service;
        public OrderTrackingController(IOrderTrackingService service)
        {
            _service = service;
        }
        
        /// <summary>
        /// Retrieves all orders for the current authenticated user.
        /// </summary>
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetUserOrders()
        {
            string userId = UserClaimsHelper.GetUserId(User);
            var data = await _service.GetUserOrderAsync(userId);
            return Ok(ApiResponse<IEnumerable<MyOrderDto>>.SuccessResponse(data));
        }
        
        /// <summary>
        /// Retrieves tracking details for a specific order belonging to the authenticated user.
        /// </summary>
        [HttpGet("Order:{orderId}")]
        public async Task<IActionResult> GetTracking(long orderId)
        {
            string userId = UserClaimsHelper.GetUserId(User);
            var data = await _service.GetOrderTrackingAsync(orderId, userId);
            return Ok(ApiResponse<OrderTrackingResponse>.SuccessResponse(data));
        }
        
        /// <summary>
        /// Updates tracking status for an order.
        /// </summary>
        [HttpPut("Order:{orderId}/status")]
        public async Task<IActionResult> UpdateStatus(long orderId, UpdateTrackingStatusRequest request)
        {
            await _service.UpdateOrderStatusAsync(orderId, request);
            return Ok(ApiResponse.SuccessResponse("Status updated successfully."));
        }
    }
}