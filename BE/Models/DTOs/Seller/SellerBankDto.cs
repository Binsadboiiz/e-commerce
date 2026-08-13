namespace BE.Models.DTOs.Seller.Shared
{
    /// <summary>
    /// Seller bank account.
    ///
    /// Used for registration and future withdrawal.
    /// </summary>
    public class SellerBankDto
    {
        public string? BankCode { get; set; }

        public string? AccountNumber { get; set; }

        public string? AccountName { get; set; }

        public bool IsPrimary { get; set; } = true;
    }
}
