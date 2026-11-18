using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Seller
{
    /// <summary>
    /// Handles seller document management.
    /// </summary>
    public interface ISellerDocumentService
    {
        Task UploadDocumentAsync(string userId, UploadSellerDocumentRequest request);

        Task DeleteDocumentAsync(string userId, long documentId);
    }
}