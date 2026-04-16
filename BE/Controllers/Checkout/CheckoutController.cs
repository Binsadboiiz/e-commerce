using BE.Middlewares;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
            var userId = GetUserId();
            var response = await _orderService.GetUserAddressesAsync(userId);
            return Ok(response);
        }

        [HttpPost("preview")]
        public async Task<IActionResult> PreviewCartCheckout([FromBody] CheckoutPreviewRequest request)
        {
            var userId = GetUserId();
            var response = await _orderService.PreviewCartCheckoutAsync(userId, request);
            return Ok(response);
        }

        [HttpPost("place-order")]
        public async Task<IActionResult> PlaceCartOrder([FromBody] CheckoutPlaceOrderRequest request)
        {
            var userId = GetUserId();
            var response = await _orderService.PlaceCartOrderAsync(userId, request);
            return Ok(response);
        }

        [HttpPost("buy-now/preview")]
        public async Task<IActionResult> PreviewBuyNow([FromBody] BuyNowRequest request)
        {
            var userId = GetUserId();
            var response = await _orderService.PreviewBuyNowAsync(userId, request);
            return Ok(response);
        }

        [HttpPost("buy-now/place-order")]
        public async Task<IActionResult> PlaceBuyNow([FromBody] BuyNowRequest request)
        {
            var userId = GetUserId();
            var response = await _orderService.PlaceBuyNowOrderAsync(userId, request);
            return Ok(response);
        }

        [HttpGet("payment-methods")]
        public IActionResult GetPaymentMethods()
        {
            return Ok(new[]
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
            });
        }

        private string GetUserId()
        {
            var claimUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(claimUserId))
            {
                return claimUserId;
            }

            var headerUserId = Request.Headers["X-User-Id"].FirstOrDefault();
            if (!string.IsNullOrEmpty(headerUserId))
            {
                return headerUserId;
            }

            throw new AppException("User is not authenticated. Please log in.");
        }
    }
}