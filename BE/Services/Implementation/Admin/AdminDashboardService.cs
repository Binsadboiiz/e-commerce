using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Constants;
using BE.Constants.Seller;
using BE.Data;
using BE.Models.DTOs.Admin.Dashboard;
using BE.Models.DTOs.Seller;
using BE.Models.DTOs.Seller.Shared;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Admin;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;

namespace BE.Services.Implementation.Admin
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly ApplicationDbContext _context;
        private readonly ISellerRepository _sellerRepository;

        public AdminDashboardService(ApplicationDbContext context, ISellerRepository sellerRepository)
        {
            _context = context;
            _sellerRepository = sellerRepository;
        }

        public async Task<AdminDashboardDto> GetDashboardAsync(string id)
        {
            var account = await _context.Accounts
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.UserId == id);

            return new AdminDashboardDto
            {
                AdminName = account?.User?.FullName ?? "Admin",
                Role = account?.Role ?? "Admin"
            };
        }

        public async Task<AdminDashboardOverviewDto> GetOverviewAsync()
        {
            var pendingSellers = await _context.SellerAccounts
                .Include(x => x.SellerStatus)
                .CountAsync(x => x.SellerStatus.Code == SellerStatusConstants.Pending);

            return new AdminDashboardOverviewDto
            {
                PendingSellerApplications = pendingSellers,
                PendingShopApplications = 0
            };
        }

        public async Task<List<AdminSellerApplicationDto>> GetSellerApplicationsAsync()
        {
            var list = await _context.SellerAccounts
                .Include(x => x.User)
                .Include(x => x.SellerType)
                .Include(x => x.SellerStatus)
                .Include(x => x.Business)
                .Where(x => x.SellerStatus.Code != SellerStatusConstants.Draft)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new AdminSellerApplicationDto
                {
                    Id = x.SellerId,
                    Representative = x.User.FullName,
                    Email = x.User.Email,
                    Phone = x.User.Phone ?? string.Empty,
                    CompanyName = x.Business != null ? (x.Business.CompanyName ?? string.Empty) : string.Empty,
                    SellerType = x.SellerType.Name,
                    Status = x.SellerStatus.Code,
                    TaxCode = x.Business != null ? (x.Business.TaxCode ?? string.Empty) : string.Empty,
                    LicenseNumber = x.Business != null ? (x.Business.BusinessLicenseNumber ?? string.Empty) : string.Empty,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return list;
        }

        public async Task<SellerRegistrationDto?> GetSellerApplicationDetailAsync(string sellerId)
        {
            var seller = await _sellerRepository.GetBySellerIdAsync(sellerId);
            if (seller == null) return null;

            var address = await _sellerRepository.GetAddressAsync(seller.SellerId);
            var bank = await _sellerRepository.GetPrimaryBankAsync(seller.SellerId);
            var business = await _sellerRepository.GetBusinessAsync(seller.SellerId);
            var documents = await _sellerRepository.GetDocumentsAsync(seller.SellerId);

            return new SellerRegistrationDto
            {
                Summary = new SellerSummaryDto
                {
                    SellerId = seller.SellerId,
                    SellerTypeId = seller.SellerTypeId,
                    SellerTypeCode = seller.SellerType.Code,
                    SellerStatusId = seller.SellerStatusId,
                    SellerStatusCode = seller.SellerStatus.Code,
                    MaxShopLimit = seller.MaxShopLimit
                },
                Address = address == null ? null : new SellerAddressDto
                {
                    FullName = address.FullName,
                    PhoneNumber = address.PhoneNumber,
                    City = address.City,
                    District = address.District,
                    Ward = address.Ward,
                    StreetAddress = address.StreetAddress,
                    PostalCode = address.PostalCode,
                    IsDefault = address.IsDefault
                },
                Bank = bank == null ? null : new SellerBankDto
                {
                    BankCode = bank.BankCode,
                    AccountNumber = bank.AccountNumber,
                    AccountName = bank.AccountName,
                    IsPrimary = bank.IsPrimary
                },
                Business = business == null ? null : new SellerBusinessDto
                {
                    CompanyName = business.CompanyName,
                    TaxCode = business.TaxCode,
                    BusinessLicenseNumber = business.BusinessLicenseNumber,
                    Representative = business.Representative
                },
                Documents = documents.Select(d => new SellerDocumentDto
                {
                    DocumentId = d.DocumentId,
                    DocumentTypeId = d.DocumentTypeId,
                    DocumentType = d.SellerDocumentType.Code,
                    FileUrl = d.FileUrl
                }).ToList(),
                Progress = new SellerRegistrationProgressDto()
            };
        }

        /// <summary>
        /// Approves a pending seller application. Updates seller status to APPROVED and upgrades user account role to SELLER.
        /// </summary>
        /// <param name="id">The unique seller ID to approve.</param>
        /// <returns>True if approval succeeds, false otherwise.</returns>
        public async Task<bool> ApproveSellerApplicationAsync(string id)
        {
            // Fetch seller account with status relationship
            var seller = await _context.SellerAccounts
                .Include(x => x.SellerStatus)
                .FirstOrDefaultAsync(x => x.SellerId == id);
            if (seller == null) 
                return false;
            
            //Fetch APPROVED status constant entity
            var approvedStatus = await _context.SellerStatuses
                .FirstOrDefaultAsync(x => x.Code == SellerStatusConstants.Approved);
            if (approvedStatus == null) 
                return false;

            //Prevent duplicate approvals
            if (seller.SellerStatusId == approvedStatus.SellerStatusId) 
                return false;
            
            //Fetch user account to upgrade system role
            var account = await _context.Accounts
                .FirstOrDefaultAsync(x => x.UserId == seller.UserId);

            if (account == null) 
                return false;
            
            //Update seller status to APPROVED
            seller.SellerStatusId = approvedStatus.SellerStatusId;
            seller.UpdatedAt = DateTime.UtcNow;

            // Upgrade user role to SELLER
            account.Role = RoleConstants.Seller;

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Rejects a pending seller application. Updates seller status to REJECTED.
        /// </summary>
        /// <param name="id">The unique seller ID to reject.</param>
        /// <returns>True if rejection succeeds, false otherwise.</returns>
        public async Task<bool> RejectSellerApplicationAsync(string id)
        {
            //Fetch seller account
            var seller = await _context.SellerAccounts
                .Include(x => x.SellerStatus)
                .FirstOrDefaultAsync(x => x.SellerId == id);
            if (seller == null) return false;

            //Fetch REJECTED status constant entity
            var rejectedStatus = await _context.SellerStatuses
                .FirstOrDefaultAsync(x => x.Code == SellerStatusConstants.Rejected);
            if (rejectedStatus == null) return false;

            //Update seller status to REJECTED
            seller.SellerStatusId = rejectedStatus.SellerStatusId;
            seller.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}