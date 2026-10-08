namespace BE.Constants
{
    public static class ProductConstants
    {
        public const int ProductNameMaxLength = 200;
        
        // Status
        public const string ProductStatusDraft = "DRAFT";
        public const string ProductStatusActive = "ACTIVE";
        public const string ProductStatusInactive = "INACTIVE";
        public const string ProductStatusDeleted = "DELETED";
        public const string ProductStatusOutOfStock = "OUT_OF_STOCK";

        public static readonly string[] AllowedStatuses =
        {
            ProductStatusActive,
            ProductStatusInactive,
            ProductStatusDeleted,
            ProductStatusOutOfStock
        };

        public static bool IsAllowedStatus(string? status) =>
            status is not null && AllowedStatuses.Contains(status, StringComparer.Ordinal);
    }
}
