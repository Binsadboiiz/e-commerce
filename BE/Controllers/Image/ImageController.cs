using BE.Services.Implementation;
using BE.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Image
{
    /// <summary>
    /// Controller for uploading image files to Cloudinary CDN.
    /// Requires authentication and rate limiting (UploadPolicy) to prevent unauthorized storage abuse.
    /// </summary>
    [Authorize]
    [EnableRateLimiting("UploadPolicy")]
    [ApiController]
    [Route("api/images")]
    public class ImageController : ControllerBase
    {
        private readonly ICloudinaryService _cloudinaryService;

        public ImageController(ICloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        /// <summary>
        /// Uploads an image file to Cloudinary and returns the secure URL.
        /// </summary>
        /// <param name="file">The image file uploaded via multipart form data.</param>
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            var url = await _cloudinaryService.UploadImageAsync(file);
            return Ok(new { url });
        }
    }
}
