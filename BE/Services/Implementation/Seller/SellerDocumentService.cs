using System;
using System.Threading.Tasks;
using BE.Middlewares;
using BE.Models.DTOs.Seller;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Seller;
using BE.Validators;

namespace BE.Services.Implementation.Seller
{
    /// <summary>
    /// Handles seller document management.
    /// </summary>
    public class SellerDocumentService : ISellerDocumentService
    {
        private readonly ISellerRepository _repository;

        public SellerDocumentService(ISellerRepository repository)
        {
            _repository = repository;
        }

        public async Task UploadDocumentAsync(string userId, UploadSellerDocumentRequest request)
        {
            SellerValidator.ValidateUploadDocument(request);

            var seller = await _repository.GetByUserIdAsync(userId);
            if (seller == null)
            {
                throw new AppException("Seller registration not found.");
            }

            if (seller.SellerStatus?.Code != Constants.Seller.SellerStatusConstants.Draft)
            {
                throw new AppException("Documents can only be uploaded when registration is in Draft status.");
            }

            var documentType = await _repository.GetDocumentTypeAsync(request.DocumentTypeId);
            if (documentType == null || !documentType.IsActive)
            {
                throw new AppException("Document type is invalid or inactive.");
            }

            var document = new SellerDocument
            {
                SellerId = seller.SellerId,
                DocumentTypeId = request.DocumentTypeId,
                FileUrl = request.FileUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddDocumentAsync(document);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteDocumentAsync(string userId, long documentId)
        {
            var seller = await _repository.GetByUserIdAsync(userId);
            if (seller == null)
            {
                throw new AppException("Seller registration not found.");
            }

            if (seller.SellerStatus?.Code != Constants.Seller.SellerStatusConstants.Draft)
            {
                throw new AppException("Documents can only be deleted when registration is in Draft status.");
            }

            var document = await _repository.GetDocumentAsync(documentId);
            if (document == null)
            {
                throw new AppException("Document not found.");
            }

            if (document.SellerId != seller.SellerId)
            {
                throw new AppException("You do not have permission to delete this document.");
            }

            _repository.RemoveDocument(document);
            await _repository.SaveChangesAsync();
        }
    }
}