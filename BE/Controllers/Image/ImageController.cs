using BE.Services.Implementation;
using BE.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Image
{
    [ApiController]
    [Route("api/images")]
    public class ImageController : ControllerBase
    {
        private readonly ICloudinaryService _cloudinaryService;

        public ImageController(ICloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            var url = await _cloudinaryService.UploadImageAsync(file);
            return Ok(new { url });
        }
    }
}
