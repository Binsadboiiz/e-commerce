namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Represents an uploaded seller verification document.
    ///
    /// Supported document types:
    /// - IDENTIFY DOC
    /// - SELFIE
    /// - BUSINESS_LICENSE
    /// </summary>
    public class SellerDocumentDto
    {

        public long DocumentId { get; set; }
        public int DocumentTypeId { get; set; }
        public string? DocumentType { get; set; }

        /// <summary>
        /// Uploaded file URL.
        /// </summary>
        public string? FileUrl { get; set; }
    }
}