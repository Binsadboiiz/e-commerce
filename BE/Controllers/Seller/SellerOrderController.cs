using System;
using System.Threading.Tasks;
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
    [Route("api/seller/orders")]
    public class SellerOrderController : ControllerBase
    {
        private readonly ISellerOrderService _orderService;

        public SellerOrderController(ISellerOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Lấy danh sách đơn hàng có chứa sản phẩm của shop retail hiện tại.
        /// Hỗ trợ lọc theo trạng thái và phân trang.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetOrders(
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            string userId = UserClaimsHelper.GetUserId(User);

            var (items, total) = await _orderService.GetOrdersAsync(userId, status, page, pageSize);

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

        /// <summary>
        /// Chi tiết đơn hàng của shop retail hiện tại.
        /// </summary>
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderDetail(long orderId)
        {
            string userId = UserClaimsHelper.GetUserId(User);

            var orderDetail = await _orderService.GetOrderDetailAsync(orderId, userId);

            if (orderDetail == null)
            {
                return NotFound(ApiResponse<object>.FailureResponse("Order not found or you do not have access to this order."));
            }

            return Ok(ApiResponse<SellerOrderDetailDto>.SuccessResponse(orderDetail));
        }

        /// <summary>
        /// Cập nhật trạng thái cho các item trong đơn hàng thuộc shop retail.
        /// </summary>
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(long orderId, [FromBody] UpdateSellerOrderStatusRequest request)
        {
            string userId = UserClaimsHelper.GetUserId(User);

            await _orderService.UpdateOrderStatusAsync(orderId, userId, request);

            return Ok(ApiResponse.SuccessResponse("Order status updated successfully."));
        }
    }
}
