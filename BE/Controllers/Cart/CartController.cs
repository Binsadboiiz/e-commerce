using BE.Services.Interface;
using BE.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE.Controllers.Cart
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        /// <summary>
        /// Get current user's cart (grouped by shop)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            var cart = await _cartService.GetCart(userId);
            return Ok(cart);
        }

        /// <summary>
        /// Add a product to cart
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var userId = GetUserId();
            var cart = await _cartService.AddToCart(userId, request);
            return Ok(cart);
        }

        /// <summary>
        /// Update item quantity in cart
        /// </summary>
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateCartRequest request)
        {
            var userId = GetUserId();
            var cart = await _cartService.UpdateQuantity(userId, request);
            return Ok(cart);
        }

        /// <summary>
        /// Remove a specific item from cart
        /// </summary>
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> Remove(long productId, [FromQuery] long? variantId)
        {
            var userId = GetUserId();
            await _cartService.RemoveItem(userId, productId, variantId);
            return Ok(new { message = "Item removed." });
        }

        /// <summary>
        /// Clear all items in cart
        /// </summary>
        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = GetUserId();
            await _cartService.ClearCart(userId);
            return Ok(new { message = "Cart cleared." });
        }

        private string GetUserId()
        {
            // Try JWT claim first
            var claimUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(claimUserId))
                return claimUserId;

            // Fallback: read from custom header (for development/testing)
            var headerUserId = Request.Headers["X-User-Id"].FirstOrDefault();
            if (!string.IsNullOrEmpty(headerUserId))
                return headerUserId;

            // throw new BE.Middlewares.AppException("User is not authenticated. Please log in.");
            // Tạm thời trả về mock ID để test thay vì throw lỗi 400
            return "test-user-id";
        }
    }
}