using BE.Middlewares;
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
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile? file)
        {
            var targetFile = file ?? (Request.HasFormContentType && Request.Form.Files.Count > 0 ? Request.Form.Files[0] : null);
            if (targetFile == null)
                throw new AppException("No file provided for upload.", 400);

            var url = await _cloudinaryService.UploadImageAsync(targetFile);
            return Ok(new { url });
        }

        /// <summary>
        /// Uploads multiple image files to Cloudinary and returns list of secure URLs.
        /// </summary>
        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultiple([FromForm] List<IFormFile>? files)
        {
            var targetFiles = files?.Where(f => f != null && f.Length > 0).ToList() ?? new List<IFormFile>();
            if (!targetFiles.Any() && Request.HasFormContentType && Request.Form.Files.Count > 0)
            {
                targetFiles = Request.Form.Files.ToList();
            }

            if (!targetFiles.Any())
                throw new AppException("No files provided for upload.", 400);

            var urls = await _cloudinaryService.UploadImagesAsync(targetFiles);
            return Ok(new { urls });
        }
    }
}
