using BE.Constants;

namespace BE.Validators
{
    public static class TrackingStatusTransitionValidator
    {
        private static readonly Dictionary<
            string,
            List<string>> AllowedTransitions
            = new()
        {
            {
                TrackingStatus.Pending,

                new()
                {
                    TrackingStatus.Confirmed,
                    TrackingStatus.Cancelled
                }
            },

            {
                TrackingStatus.Confirmed,

                new()
                {
                    TrackingStatus.Preparing,
                    TrackingStatus.Cancelled
                }
            },

            {
                TrackingStatus.Preparing,

                new()
                {
                    TrackingStatus.Shipped
                }
            },

            {
                TrackingStatus.Shipped,

                new()
                {
                    TrackingStatus.InTransit
                }
            },

            {
                TrackingStatus.InTransit,

                new()
                {
                    TrackingStatus.OutForDelivery
                }
            },

            {
                TrackingStatus.OutForDelivery,

                new()
                {
                    TrackingStatus.Delivered,
                    TrackingStatus.DeliveryFailed
                }
            },

            {
                TrackingStatus.DeliveryFailed,

                new()
                {
                    TrackingStatus.OutForDelivery
                }
            },

            {
                TrackingStatus.Delivered,

                new()
            },

            {
                TrackingStatus.Cancelled,

                new()
            }
        };


        public static bool IsValidTransition(
            string currentStatus,
            string nextStatus)
        {
            if(!AllowedTransitions.ContainsKey(
                currentStatus))
                return false;

            return AllowedTransitions[
                currentStatus]
                .Contains(nextStatus);
        }
        
        public static class TrackingStatusValidator
        {
            private static readonly HashSet<string>
                ValidStatuses = new()
                {
                    TrackingStatus.Pending,
                    TrackingStatus.Confirmed,
                    TrackingStatus.Preparing,
                    TrackingStatus.Shipped,
                    TrackingStatus.InTransit,
                    TrackingStatus.OutForDelivery,
                    TrackingStatus.Delivered,
                    TrackingStatus.Cancelled
                };

            public static bool IsValidStatus(
                string status)
            {
                return ValidStatuses.Contains(status);
            }
        }
    }
}