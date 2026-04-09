using BE.Services.Interface;
using BE.Services.Implementation;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var cart = await _cartService.GetCart(userId);
            return Ok(cart);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(long productId, int quantity)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _cartService.AddToCart(userId, productId, quantity);
            return Ok();
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(long productId, int quantity)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _cartService.UpdateQuantity(userId, productId, quantity);
            return Ok();
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> Remove(long productId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _cartService.RemoveItem(userId, productId);
            return Ok();
        }
    }
}