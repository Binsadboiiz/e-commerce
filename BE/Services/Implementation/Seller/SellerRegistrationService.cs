using BE.Constants.Seller;
using BE.Middlewares;
using BE.Models.DTOs.Seller;
using BE.Models.DTOs.Seller.Shared;
using BE.Models.Entities;
using BE.Repositories.Interfaces;
using BE.Services.Interface.Seller;
using BE.Validators;

namespace BE.Services.Implementation.Seller
{
    /// <summary>
    /// Handles seller registration workflow.
    /// </summary>
    public class SellerRegistrationService : ISellerRegistrationService
    {
        private readonly ISellerRepository _repository;

        public SellerRegistrationService(ISellerRepository repository)
        {
            _repository = repository;
        }

        public async Task<SellerRegistrationDto?> GetRegistrationAsync(string userId)
        {
            var seller = await _repository.GetByUserIdAsync(userId);

            if (seller == null)
                return null;

            var address = await _repository.GetAddressAsync(seller.SellerId);

            var bank = await _repository.GetPrimaryBankAsync(seller.SellerId);

            var business = await _repository.GetBusinessAsync(seller.SellerId);

            var documents = await _repository.GetDocumentsAsync(seller.SellerId);

            return new SellerRegistrationDto
            {
                Summary = MapSummary(seller),
                Address = MapAddress(address),
                Bank = MapBank(bank),
                Business = MapBusiness(business),
                Documents = MapDocuments(documents),
                Progress = BuildProgress(
                    seller,
                    address,
                    bank,
                    business,
                    documents)
            };
        }

        //CREATE
        public async Task CreateRegistrationAsync(string userId, CreateSellerRegistrationRequest request)
        {
            SellerValidator.ValidateCreate(request);

            var existedSeller = await _repository.GetByUserIdAsync(userId);

            if (existedSeller != null)
                throw new AppException("Seller registration already exists.");

            var sellerType = await _repository.GetSellerTypeAsync(request.SellerTypeId);

            if (sellerType == null)
                throw new AppException("Seller type is invalid.");

            var draftStatus = await _repository.GetSellerStatusByCodeAsync(
                SellerStatusConstants.Draft);

            if (draftStatus == null)
                throw new AppException("Default seller status is not configured.");

            var seller = new SellerAccount
            {
                UserId = userId,
                SellerTypeId = sellerType.SellerTypeId,
                SellerStatusId = draftStatus.SellerStatusId,
                MaxShopLimit = 1
            };

            await _repository.AddSellerAsync(seller);

            await _repository.SaveChangesAsync();
        }

        //UPDATE
        public async Task UpdateRegistrationAsync(string userId, UpdateSellerRegistrationRequest request)
        {
            SellerValidator.ValidateUpdate(request);

            var seller = await _repository.GetByUserIdAsync(userId);

            if (seller == null)
                throw new AppException("Seller registration not found.");

            // Address
            if (request.Address != null)
            {
                var address = await _repository.GetAddressAsync(seller.SellerId);

                if (address == null)
                {
                    address = new SellerAddress
                    {
                        SellerId = seller.SellerId,
                        FullName = request.Address.FullName!,
                        PhoneNumber = request.Address.PhoneNumber!,
                        City = request.Address.City,
                        District = request.Address.District,
                        Ward = request.Address.Ward,
                        StreetAddress = request.Address.StreetAddress,
                        PostalCode = request.Address.PostalCode,
                        IsDefault = request.Address.IsDefault
                    };

                    await _repository.AddAddressAsync(address);
                }
                else
                {
                    address.FullName = request.Address.FullName!;
                    address.PhoneNumber = request.Address.PhoneNumber!;
                    address.City = request.Address.City;
                    address.District = request.Address.District;
                    address.Ward = request.Address.Ward;
                    address.StreetAddress = request.Address.StreetAddress;
                    address.PostalCode = request.Address.PostalCode;
                    address.IsDefault = request.Address.IsDefault;
                }
            }

            // Bank
            if (request.Bank != null)
            {
                var bank = await _repository.GetPrimaryBankAsync(seller.SellerId);

                if (bank == null)
                {
                    bank = new SellerBank
                    {
                        SellerId = seller.SellerId,
                        BankCode = request.Bank.BankCode,
                        AccountNumber = request.Bank.AccountNumber,
                        AccountName = request.Bank.AccountName,
                        IsPrimary = request.Bank.IsPrimary
                    };

                    await _repository.AddBankAsync(bank);
                }
                else
                {
                    bank.BankCode = request.Bank.BankCode;
                    bank.AccountNumber = request.Bank.AccountNumber;
                    bank.AccountName = request.Bank.AccountName;
                    bank.IsPrimary = request.Bank.IsPrimary;
                }
            }

            // Business
            if (request.Business != null)
            {
                if (seller.SellerType.Code != SellerTypeConstants.Business)
                    throw new AppException("Only business sellers can update business information.");

                var business = await _repository.GetBusinessAsync(seller.SellerId);

                if (business == null)
                {
                    business = new SellerBusiness
                    {
                        SellerId = seller.SellerId,
                        CompanyName = request.Business.CompanyName,
                        TaxCode = request.Business.TaxCode,
                        BusinessLicenseNumber = request.Business.BusinessLicenseNumber,
                        Representative = request.Business.Representative
                    };

                    await _repository.AddBusinessAsync(business);
                }
                else
                {
                    business.CompanyName = request.Business.CompanyName;
                    business.TaxCode = request.Business.TaxCode;
                    business.BusinessLicenseNumber = request.Business.BusinessLicenseNumber;
                    business.Representative = request.Business.Representative;
                }
            }

            await _repository.SaveChangesAsync();
        }

        //SUBMIT
        public async Task SubmitRegistrationAsync(string userId)
        {
            var seller = await _repository.GetByUserIdAsync(userId);

            if (seller == null)
                throw new AppException("Seller registration not found.");

            if (seller.SellerStatus.Code != SellerStatusConstants.Draft &&
                seller.SellerStatus.Code != SellerStatusConstants.Rejected)
                throw new AppException("Seller registration cannot be submitted.");

            var address = await _repository.GetAddressAsync(seller.SellerId);

            if (address == null)
                throw new AppException("Seller address is required.");

            var bank = await _repository.GetPrimaryBankAsync(seller.SellerId);

            if (bank == null)
                throw new AppException("Seller bank account is required.");

            if (seller.SellerType.Code == SellerTypeConstants.Business)
            {
                var business = await _repository.GetBusinessAsync(seller.SellerId);

                if (business == null)
                    throw new AppException("Business information is required.");
            }

            var documents = await _repository.GetDocumentsAsync(seller.SellerId);

            if (!documents.Any())
                throw new AppException("At least one verification document is required.");

            var pendingStatus = await _repository.GetSellerStatusByCodeAsync(
                SellerStatusConstants.Pending);

            if (pendingStatus == null)
                throw new AppException("Pending status is not configured.");

            seller.SellerStatusId = pendingStatus.SellerStatusId;

            await _repository.SaveChangesAsync();
        }

        // Mapping
        private SellerSummaryDto MapSummary(SellerAccount seller)
        {
            return new SellerSummaryDto
            {
                SellerId = seller.SellerId,
                SellerTypeId = seller.SellerTypeId,
                SellerTypeCode = seller.SellerType.Code,
                SellerStatusId = seller.SellerStatusId,
                SellerStatusCode = seller.SellerStatus.Code,
                MaxShopLimit = seller.MaxShopLimit
            };
        }

        private SellerAddressDto? MapAddress(SellerAddress? address)
        {
            if (address == null)
                return null;

            return new SellerAddressDto
            {
                FullName = address.FullName,
                PhoneNumber = address.PhoneNumber,
                City = address.City,
                District = address.District,
                Ward = address.Ward,
                StreetAddress = address.StreetAddress,
                PostalCode = address.PostalCode,
                IsDefault = address.IsDefault
            };
        }

        private SellerBankDto? MapBank(SellerBank? bank)
        {
            if (bank == null)
                return null;

            return new SellerBankDto
            {
                BankCode = bank.BankCode,
                AccountNumber = bank.AccountNumber,
                AccountName = bank.AccountName,
                IsPrimary = bank.IsPrimary
            };
        }

        private SellerBusinessDto? MapBusiness(SellerBusiness? business)
        {
            if (business == null)
                return null;

            return new SellerBusinessDto
            {
                CompanyName = business.CompanyName,
                TaxCode = business.TaxCode,
                BusinessLicenseNumber = business.BusinessLicenseNumber,
                Representative = business.Representative
            };
        }

        private List<SellerDocumentDto> MapDocuments(
            List<SellerDocument> documents)
        {
            return documents
                .Select(x => new SellerDocumentDto
                {
                    DocumentId = x.DocumentId,
                    DocumentTypeId = x.DocumentTypeId,
                    DocumentType = x.SellerDocumentType.Code,
                    FileUrl = x.FileUrl
                })
                .ToList();
        }


        //Progress
        private SellerRegistrationProgressDto BuildProgress(
            SellerAccount seller,
            SellerAddress? address,
            SellerBank? bank,
            SellerBusiness? business,
            List<SellerDocument> documents)
        {
            int completedSteps = 0;

            if (address != null)
                completedSteps++;

            if (bank != null)
                completedSteps++;

            if (documents.Any())
                completedSteps++;

            bool isBusiness =
                seller.SellerType.Code == SellerTypeConstants.Business;

            if (isBusiness && business != null)
                completedSteps++;

            int totalSteps = isBusiness ? 4 : 3;

            int currentStep = Math.Min(completedSteps + 1, totalSteps);

            return new SellerRegistrationProgressDto
            {
                CurrentStep = currentStep,
                CompletedSteps = completedSteps,
                TotalSteps = totalSteps,
                CanSubmit = completedSteps == totalSteps
            };
        }

        public async Task ChangeSellerTypeAsync(string userId, ChangeSellerTypeRequest request)
        {
            var seller = await _repository.GetByUserIdAsync(userId);

            if (seller == null)
                throw new Exception("Seller registration is not found");

            if (seller.SellerStatus.Code != SellerStatusConstants.Draft)
                throw new AppException("Seller type can only be changed while registration is in Draft state.");

            var sellerType = await _repository.GetSellerTypeAsync(request.SellerTypeId);

            if (sellerType == null)
                throw new AppException("Invalid seller type.");

            if (seller.SellerTypeId == request.SellerTypeId)
                return;

            await _repository.ClearRegistrationAsync(seller.SellerId);

            seller.SellerTypeId = sellerType.SellerTypeId;

            await _repository.SaveChangesAsync();
        }

    }
}