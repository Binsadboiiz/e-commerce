namespace BE.Constants
{
    public static class TrackingStatus
    {
        public const string Pending = "pending";

        public const string Confirmed = "confirmed";

        public const string Preparing = "preparing";

        public const string Shipped = "shipped";

        public const string InTransit = "in_transit";

        public const string OutForDelivery =
            "out_for_delivery";

        public const string Delivered =
            "delivered";

        public const string DeliveryFailed =
            "delivery_failed";

        public const string Cancelled =
            "cancelled";
    }
}