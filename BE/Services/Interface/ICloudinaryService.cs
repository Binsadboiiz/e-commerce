using Microsoft.AspNetCore.Http;

namespace BE.Services.Interface
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task<List<string>> UploadImagesAsync(IEnumerable<IFormFile> files);
    }
}