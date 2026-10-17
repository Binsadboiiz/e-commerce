using Microsoft.AspNetCore.Http;

namespace BE.Services.Interface.Image
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task<List<string>> UploadImagesAsync(IEnumerable<IFormFile> files);
    }
}