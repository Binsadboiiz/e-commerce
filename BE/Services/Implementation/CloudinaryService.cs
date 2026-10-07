using BE.Middlewares;
using BE.Services.Interface;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BE.Services.Implementation
{
    /// <summary>
    /// Service for handling image uploads to Cloudinary CDN with security validation.
    /// </summary>
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB maximum file size limit
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/jpg", "image/png", "image/webp" };

        public CloudinaryService(IConfiguration config)
        {
            var cloudName = config["Cloudinary:CloudName"]
                            ?? Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
            var apiKey = config["Cloudinary:ApiKey"]
                         ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
            var apiSecret = config["Cloudinary:ApiSecret"]
                          ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

            var cloudinaryUrl = Environment.GetEnvironmentVariable("CLOUDINARY_URL");

            if (!string.IsNullOrWhiteSpace(cloudinaryUrl))
            {
                _cloudinary = new Cloudinary(cloudinaryUrl);
            }
            else if (!string.IsNullOrWhiteSpace(cloudName) && !string.IsNullOrWhiteSpace(apiKey) && !string.IsNullOrWhiteSpace(apiSecret))
            {
                var account = new Account(cloudName, apiKey, apiSecret);
                _cloudinary = new Cloudinary(account);
            }
            else
            {
                throw new InvalidOperationException(
                    "Cloudinary credentials are not properly configured. Please set 'Cloudinary:CloudName', 'Cloudinary:ApiKey', and 'Cloudinary:ApiSecret' in appsettings.Development.json or set environment variables (Cloudinary__ApiKey, Cloudinary__ApiSecret, or CLOUDINARY_URL).");
            }

            _cloudinary.Api.Secure = true; // Enforce HTTPS for Cloudinary URL generation
        }

        /// <summary>
        /// Validates and uploads an image file to Cloudinary CDN.
        /// </summary>
        /// <param name="file">Form file submitted by the client.</param>
        /// <returns>Secure HTTPS URL of the uploaded image.</returns>
        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new AppException("File is empty. Please select a valid file to upload.", 400);

            // 1. File Size Validation
            if (file.Length > MaxFileSizeBytes)
                throw new AppException($"File size exceeds the maximum limit of {MaxFileSizeBytes / (1024 * 1024)}MB.", 400);

            // 2. Extension Validation
            var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
                throw new AppException("Invalid file format. Only JPEG, PNG, and WebP images are allowed.", 400);

            // 3. MIME Type Validation
            if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
                throw new AppException("Invalid MIME type. Uploaded file must be a valid image.", 400);

            using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "veloramall/products",
                UseFilename = false, // Randomize filename on CDN to prevent path traversal or collision attacks
                UniqueFilename = true
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new AppException($"Cloudinary upload failed: {result.Error.Message}", 500);

            return result.SecureUrl?.ToString() ?? "";
        }

        /// <summary>
        /// Validates and uploads multiple image files concurrently to Cloudinary CDN.
        /// </summary>
        /// <param name="files">List of form files submitted by the client.</param>
        /// <returns>List of secure HTTPS URLs of the uploaded images.</returns>
        public async Task<List<string>> UploadImagesAsync(IEnumerable<IFormFile> files)
        {
            if (files == null || !files.Any())
                throw new AppException("No files provided for upload.", 400);

            var uploadTasks = files.Select(file => UploadImageAsync(file));
            var results = await Task.WhenAll(uploadTasks);
            return results.ToList();
        }
    }
}
