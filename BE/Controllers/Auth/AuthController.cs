using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Auth
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpGet("profile")]
        public IActionResult Profile()
        {
            return Ok(new
            {
                message = "profile api working"
            });
        }
    }
}