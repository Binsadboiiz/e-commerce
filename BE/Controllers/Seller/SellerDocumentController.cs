using BE.Models.DTOs;
using BE.Models.DTOs.Seller;
using BE.Services.Interface.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE.Controllers.Seller
{
    /// <summary>
    /// Handles seller document management.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/seller/documents")]
    public class SellerDocumentController : ControllerBase
    {
        private readonly ISellerDocumentService _documentService;

        public SellerDocumentController(
            ISellerDocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(
            [FromBody] UploadSellerDocumentRequest request)
        {
            string userId = GetUserId();

            await _documentService.UploadDocumentAsync(userId, request);

            return Ok(ApiResponse.SuccessResponse("Document uploaded successfully."));
        }

        [HttpDelete("{documentId:long}")]
        public async Task<IActionResult> Delete(long documentId)
        {
            string userId = GetUserId();

            await _documentService.DeleteDocumentAsync(userId, documentId);

            return Ok(ApiResponse.SuccessResponse("Document deleted successfully."));
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }
    }
}