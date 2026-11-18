using System;
using System.Threading.Tasks;
using BE.Constants.Seller;
using BE.Models.DTOs.Seller;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Seller;

namespace BE.Services.Implementation.Seller
{
    /// <summary>
    /// Provides seller information for application header.
    /// </summary>
    public class SellerHeaderService : ISellerHeaderService
    {
        private readonly ISellerRepository _repository;

        public SellerHeaderService(ISellerRepository repository)
        {
            _repository = repository;
        }

        public async Task<SellerHeaderDto> GetHeaderAsync(string userId)
        {
            var seller = await _repository.GetByUserIdAsync(userId);
            if (seller == null)
            {
                return new SellerHeaderDto
                {
                    IsSeller = false,
                    SellerStatusCode = null,
                    HeaderAction = "REGISTER"
                };
            }

            var statusCode = seller.SellerStatus?.Code;
            var headerAction = statusCode == SellerStatusConstants.Approved 
                ? "SELLER_CENTER" 
                : "REGISTER";

            return new SellerHeaderDto
            {
                IsSeller = true,
                SellerStatusCode = statusCode,
                HeaderAction = headerAction
            };
        }
    }
}