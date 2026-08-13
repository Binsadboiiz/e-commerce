using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Order
{
    [Route("api/order-tracking")]
    [ApiController]
    public class OrderTrackingController : ControllerBase
    {
        private readonly IOrderTrackingService _service;
        public OrderTrackingController(IOrderTrackingService service)
        {
            _service = service;
        }
        
        //Get orders
        [HttpGet("{userId}/my-orders")]
        public async Task<IActionResult> GetUserOrders(string userId)
        {
            var data = await _service.GetUserOrderAsync(userId);
            return Ok(ApiResponse<IEnumerable<MyOrderDto>>.SuccessResponse(data));
        }
        
        //Get order tracking
        [HttpGet("Order:{orderId}/{userId}")]
        public async Task<IActionResult> GetTracking(long orderId, string userId)
        {
            var data = await _service.GetOrderTrackingAsync(orderId, userId);
            return Ok(ApiResponse<OrderTrackingResponse>.SuccessResponse(data));
        }
        
        //Update Status
        [HttpPut("Order:{orderId}/status")]
        public async Task<IActionResult> UpdateStatus(long orderId, UpdateTrackingStatusRequest request)
        {
            await _service.UpdateOrderStatusAsync(orderId, request);
            return Ok(ApiResponse.SuccessResponse("Status updated successfully."));
        }
    }
}