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

        public static readonly string[] AllowedStatuses =
        {
            ProductStatusDraft,
            ProductStatusActive,
            ProductStatusInactive,
            ProductStatusDeleted
        };
    }
}