using BE.Models.DTOs.Auth;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Auth
{
    /// <summary>
    /// Authentication Controller handling User Registration, Login, Profile retrieval, and Logout.
    /// Protected with strict Rate Limiting (AuthPolicy) to prevent brute-force attacks.
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets the current authenticated user profile, or returns Guest status if unauthenticated.
        /// </summary>
        [HttpGet("profile")]
        [EnableRateLimiting("GeneralPolicy")]
        public async Task<IActionResult> Profile()
        {
            if (User?.Identity == null || !User.Identity.IsAuthenticated)
            {
                return Ok(ApiResponse<UserDto>.SuccessResponse(
                    null, "Guest user"
                ));
            }
            var userId = Helpers.UserClaimsHelper.GetUserId(User);
            var result = await _service.GetProfileAsync(userId);
            return Ok(ApiResponse<UserDto>.SuccessResponse(result));
        }

        /// <summary>
        /// Registers a new user account and sets the JWT access token cookie.
        /// </summary>
        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _service.RegisterAsync(request);
            SetCookie(result.AccessToken);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Register Successfully!"));
        }

        /// <summary>
        /// Authenticates user credentials and sets the JWT access token cookie upon successful login.
        /// </summary>
        [HttpPost("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _service.LoginAsync(request);
            SetCookie(result.AccessToken);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Login Successfully!"));
        }

        /// <summary>
        /// Logs out the user by clearing the access token cookie.
        /// </summary>
        [HttpPost("logout")]
        [DisableRateLimiting]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("accessToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(ApiResponse.SuccessResponse("Logout success"));
        }

        /// <summary>
        /// Attaches the JWT access token to the HTTP Response as an HttpOnly, Secure cookie.
        /// </summary>
        /// <param name="token">The generated JWT access token string.</param>
        private void SetCookie(string token)
        {
            Response.Cookies.Append(
                "accessToken",
                token,
                new CookieOptions
                {
                    HttpOnly = true, // Prevents client-side JavaScript access (XSS protection)
                    Secure = true,   // Requires HTTPS transmission
                    SameSite = SameSiteMode.None, // Supports cross-site API calls (e.g., local dev port differences)
                    Expires = DateTime.UtcNow.AddDays(7)
                }
            );
        }
    }
}