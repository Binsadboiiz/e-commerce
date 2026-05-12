using BE.Models.DTOs.Auth;
using BE.Models.DTOs;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Reflection.Metadata;
using System.Security;


namespace BE.Controllers.Auth
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            if(!User.Identity.IsAuthenticated)
            {
                return Ok(ApiResponse<UserDto>.SuccessResponse(
                    null, "Guest user"
                ));
            }
            var userId = Helpers.UserClaimsHelper.GetUserId(User);
            var result = await _service.GetProfileAsync(userId);
            return Ok(ApiResponse<UserDto>.SuccessResponse(result));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _service.RegisterAsync(request);

            SetCookie(result.AccessToken);

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Register Successfully!"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _service.LoginAsync(request);

            SetCookie(result.AccessToken);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Login Successfully!"));
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("accessToken");

            return Ok(ApiResponse.SuccessResponse("Logout success"));
        }

        private void SetCookie(string token)
        {
            Response.Cookies.Append(
                "accessToken",
                token,
                new CookieOptions
                {
                    HttpOnly = true,

                    // === Https ===
                    Secure = true,
                    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,

                    // === Development  Env ===
                    // Secure = false,
                    // SameSite = SameSiteMode.Lax,

                    Expires = DateTime.UtcNow.AddDays(7)
                }
            );
        }
    }
}