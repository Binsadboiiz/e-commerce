using BE.Middlewares;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BE.Helpers;

namespace BE.Controllers.Checkout
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public CheckoutController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var response = await _orderService.GetUserAddressesAsync(userId);
            return Ok(ApiResponse<IEnumerable<CheckoutAddressDto>>.SuccessResponse(response));
        }

        [HttpPost("preview")]
        public async Task<IActionResult> PreviewCartCheckout([FromBody] CheckoutPreviewRequest request)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var response = await _orderService.PreviewCartCheckoutAsync(userId, request);
            return Ok(ApiResponse<CheckoutPreviewResponse>.SuccessResponse(response));
        }

        [HttpPost("place-order")]
        public async Task<IActionResult> PlaceCartOrder([FromBody] CheckoutPlaceOrderRequest request)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var response = await _orderService.PlaceCartOrderAsync(userId, request);
            return Ok(ApiResponse<PlaceOrderResponse>.SuccessResponse(response, "Order placed successfully."));
        }

        [HttpPost("buy-now/preview")]
        public async Task<IActionResult> PreviewBuyNow([FromBody] BuyNowRequest request)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var response = await _orderService.PreviewBuyNowAsync(userId, request);
            return Ok(ApiResponse<CheckoutPreviewResponse>.SuccessResponse(response));
        }

        [HttpPost("buy-now/place-order")]
        public async Task<IActionResult> PlaceBuyNow([FromBody] BuyNowRequest request)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var response = await _orderService.PlaceBuyNowOrderAsync(userId, request);
            return Ok(ApiResponse<PlaceOrderResponse>.SuccessResponse(response, "Order placed successfully."));
        }

        [HttpGet("payment-methods")]
        public IActionResult GetPaymentMethods()
        {
            var methods = new[]
            {
                new
                {
                    code = "cod",
                    label = "Cash on Delivery",
                    isEnabled = true
                },
                new
                {
                    code = "card",
                    label = "Credit/Debit Card",
                    isEnabled = false
                },
                new
                {
                    code = "googlepay",
                    label = "Google Pay",
                    isEnabled = false
                }
            };
            return Ok(ApiResponse<object>.SuccessResponse(methods));
        }
    }
}