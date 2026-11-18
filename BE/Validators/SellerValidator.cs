using System;
using System.Text.RegularExpressions;
using BE.Middlewares;
using BE.Models.DTOs.Seller;
using BE.Models.DTOs.Seller.Shared;

namespace BE.Validators
{
    /// <summary>
    /// Validates seller registration requests.
    /// </summary>
    public static class SellerValidator
    {
        private static readonly Regex PhoneRegex = new(@"^\d{9,11}$");
        private static readonly Regex BankAccountRegex = new(@"^[a-zA-Z0-9]{8,20}$");
        private static readonly Regex TaxCodeRegex = new(@"^\d{10}$|^\d{13}$");

        public static void ValidateCreate(CreateSellerRegistrationRequest request)
        {
            if (request == null)
                throw new AppException("Request is required.");

            if (request.SellerTypeId <= 0)
                throw new AppException("Seller type is required.");
        }

        public static void ValidateUpdate(UpdateSellerRegistrationRequest request)
        {
            if (request == null)
                throw new AppException("Request is required.");

            ValidateAddress(request.Address);

            ValidateBank(request.Bank);

            if (request.Business != null)
            {
                ValidateBusiness(request.Business);
            }
        }

        public static void ValidateUploadDocument(UploadSellerDocumentRequest request)
        {
            if (request == null)
                throw new AppException("Request is required.");

            if (request.DocumentTypeId <= 0)
                throw new AppException("Document type is required.");

            if (string.IsNullOrWhiteSpace(request.FileUrl))
                throw new AppException("File url is required.");

            if (request.FileUrl.Length > 2000)
                throw new AppException("File URL is too long (max 2000 characters).");

            if (!Uri.TryCreate(request.FileUrl, UriKind.Absolute, out var uriResult) ||
                (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
            {
                throw new AppException("File URL must be a valid http or https link.");
            }
        }

        public static void ValidateAddress(SellerAddressDto? address)
        {
            if (address == null)
                return;

            if (string.IsNullOrWhiteSpace(address.FullName))
                throw new AppException("Full name is required.");

            if (address.FullName.Length > 255)
                throw new AppException("Full name cannot exceed 255 characters.");

            if (string.IsNullOrWhiteSpace(address.PhoneNumber))
                throw new AppException("Phone number is required.");

            if (address.PhoneNumber.Length > 20)
                throw new AppException("Phone number cannot exceed 20 characters.");

            if (!PhoneRegex.IsMatch(address.PhoneNumber))
                throw new AppException("Phone number must contain 9 to 11 digits.");

            if (string.IsNullOrWhiteSpace(address.City))
                throw new AppException("City is required.");

            if (address.City.Length > 100)
                throw new AppException("City name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(address.District))
                throw new AppException("District is required.");

            if (address.District.Length > 100)
                throw new AppException("District name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(address.Ward))
                throw new AppException("Ward is required.");

            if (address.Ward.Length > 100)
                throw new AppException("Ward name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(address.StreetAddress))
                throw new AppException("Street address is required.");

            if (address.StreetAddress.Length > 255)
                throw new AppException("Street address cannot exceed 255 characters.");

            if (address.PostalCode != null && address.PostalCode.Length > 20)
                throw new AppException("Postal code cannot exceed 20 characters.");
        }

        public static void ValidateBank(SellerBankDto? bank)
        {
            if (bank == null)
                return;

            if (string.IsNullOrWhiteSpace(bank.BankCode))
                throw new AppException("Bank is required.");

            if (bank.BankCode.Length > 50)
                throw new AppException("Bank code cannot exceed 50 characters.");

            if (string.IsNullOrWhiteSpace(bank.AccountNumber))
                throw new AppException("Account number is required.");

            if (bank.AccountNumber.Length > 100)
                throw new AppException("Account number cannot exceed 100 characters.");

            if (!BankAccountRegex.IsMatch(bank.AccountNumber))
                throw new AppException("Account number must contain 8 to 20 alphanumeric characters.");

            if (string.IsNullOrWhiteSpace(bank.AccountName))
                throw new AppException("Account name is required.");

            if (bank.AccountName.Length > 255)
                throw new AppException("Account name cannot exceed 255 characters.");
        }

        public static void ValidateBusiness(SellerBusinessDto business)
        {
            if (string.IsNullOrWhiteSpace(business.CompanyName))
                throw new AppException("Company name is required.");

            if (business.CompanyName.Length > 255)
                throw new AppException("Company name cannot exceed 255 characters.");

            if (string.IsNullOrWhiteSpace(business.TaxCode))
                throw new AppException("Tax code is required.");

            if (business.TaxCode.Length > 100)
                throw new AppException("Tax code cannot exceed 100 characters.");

            if (!TaxCodeRegex.IsMatch(business.TaxCode))
                throw new AppException("Tax code must be a sequence of 10 or 13 digits.");

            if (string.IsNullOrWhiteSpace(business.BusinessLicenseNumber))
                throw new AppException("Business license number is required.");

            if (business.BusinessLicenseNumber.Length > 100)
                throw new AppException("Business license number cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(business.Representative))
                throw new AppException("Representative is required.");

            if (business.Representative.Length > 255)
                throw new AppException("Representative name cannot exceed 255 characters.");
        }

        public static void ValidateChangeSellerType(ChangeSellerTypeRequest request)
        {
            if (request.SellerTypeId <= 0)
                throw new AppException("Seller type is required.");
        }
    }
}