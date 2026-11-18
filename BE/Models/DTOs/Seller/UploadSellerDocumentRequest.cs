namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Request to upload a seller document.
    /// </summary>
    public class UploadSellerDocumentRequest
    {
        public int DocumentTypeId { get; set; }

        public string FileUrl { get; set; } = string.Empty;
    }
}