using BE.Services.Interface;
using BE.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BE.Helpers;

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
            var userId = UserClaimsHelper.GetUserId(User);
            var cart = await _cartService.GetCart(userId);
            return Ok(cart);
        }

        /// <summary>
        /// Add a product to cart
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var cart = await _cartService.AddToCart(userId, request);
            return Ok(cart);
        }

        /// <summary>
        /// Update item quantity in cart
        /// </summary>
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateCartRequest request)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            var cart = await _cartService.UpdateQuantity(userId, request);
            return Ok(cart);
        }

        /// <summary>
        /// Remove a specific item from cart
        /// </summary>
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> Remove(long productId, [FromQuery] long? variantId)
        {
            var userId = UserClaimsHelper.GetUserId(User);
            await _cartService.RemoveItem(userId, productId, variantId);
            return Ok(new { message = "Item removed." });
        }

        /// <summary>
        /// Clear all items in cart
        /// </summary>
        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = UserClaimsHelper.GetUserId(User);
            await _cartService.ClearCart(userId);
            return Ok(new { message = "Cart cleared." });
        }
    }
}