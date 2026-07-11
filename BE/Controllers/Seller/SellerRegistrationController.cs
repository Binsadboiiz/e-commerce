using BE.Models.DTOs;
using BE.Models.DTOs.Seller;
using BE.Services.Interface.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE.Controllers.Seller
{
    /// <summary>
    /// Handles seller registration workflow.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/seller/registration")]
    public class SellerRegistrationController : ControllerBase
    {
        private readonly ISellerRegistrationService _registrationService;

        public SellerRegistrationController(
            ISellerRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRegistration()
        {
            string userId = GetUserId();

            var result = await _registrationService.GetRegistrationAsync(userId);

            return Ok(ApiResponse<SellerRegistrationDto?>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateSellerRegistrationRequest request)
        {
            string userId = GetUserId();

            await _registrationService.CreateRegistrationAsync(userId, request);

            return Ok(ApiResponse.SuccessResponse("Seller registration created successfully."));
        }

        [HttpPut]
        public async Task<IActionResult> Update(
            [FromBody] UpdateSellerRegistrationRequest request)
        {
            string userId = GetUserId();

            await _registrationService.UpdateRegistrationAsync(userId, request);

            return Ok(ApiResponse.SuccessResponse("Seller registration updated successfully."));
        }

        [HttpPost("submit")]
        public async Task<IActionResult> Submit()
        {
            string userId = GetUserId();

            await _registrationService.SubmitRegistrationAsync(userId);

            return Ok(ApiResponse.SuccessResponse("Seller registration submitted successfully."));
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        [HttpPut("seller-type")]
        public async Task<IActionResult> ChangeSellerType(
        [FromBody] ChangeSellerTypeRequest request)
        {
            string userId = GetUserId();

            await _registrationService.ChangeSellerTypeAsync(userId, request);

            return Ok(ApiResponse.SuccessResponse("Seller type changed successfully."));
        }
    }
}