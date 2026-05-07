using BE.Models.DTOs.Auth;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;


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
        public IActionResult Profile()
        {
            return Ok(new
            {
                message = "profile api working"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _service.RegisterAsync(request);

            SetCookie(result.AccessToken);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _service.LoginAsync(request);

            SetCookie(result.AccessToken);
            return Ok(result);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("accessToken");

            return Ok(new
            {
                message = "Logout success"
            });
        }

        private void SetCookie(string token)
        {
            Response.Cookies.Append(
                "accessToken",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                }
            );
        }
    }
}