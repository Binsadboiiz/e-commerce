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

    public static class ProductAttributeConstants
    {
        public const string Color = "Color";
        public const string Size = "Size";
        public const string Material = "Material";
        public const string Style = "Style";
        public const string Option = "Option";
        public const string DefaultVariantName = "Standard";
    }

    public static class ProductSortConstants
    {
        public const string PriceAsc = "price_asc";
        public const string PriceDesc = "price_desc";
        public const string Rating = "rating";
        public const string Sold = "sold";
        public const string StockAsc = "stock_asc";
        public const string StockDesc = "stock_desc";
        public const string NameAsc = "name_asc";
        public const string NameDesc = "name_desc";
        public const string Oldest = "oldest";
        public const string Newest = "newest";
    }
}
