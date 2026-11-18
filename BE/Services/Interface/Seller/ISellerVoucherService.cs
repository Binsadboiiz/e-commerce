using BE.Models.DTOs.Seller;

namespace BE.Services.Interface.Seller
{
    public interface ISellerVoucherService
    {
        Task<(List<VoucherDto> Items, int Total)> GetVouchersBySellerAsync(string sellerUserId, int page, int pageSize, string? search);
        Task<VoucherDto> CreateVoucherAsync(string sellerUserId, CreateVoucherRequest request);
        Task<VoucherDto> UpdateVoucherAsync(long voucherId, string sellerUserId, UpdateVoucherRequest request);
        Task DeleteVoucherAsync(long voucherId, string sellerUserId);
    }
}
