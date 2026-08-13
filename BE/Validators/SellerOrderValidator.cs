using BE.Constants;
using BE.Middlewares;
using BE.Models.DTOs.Seller;

namespace BE.Validators
{
    public static class SellerOrderValidator
    {
        public static void ValidateUpdateStatusRequest(UpdateSellerOrderStatusRequest request)
        {
            if (request == null)
            {
                throw new AppException("Request payload cannot be null", 400);
            }

            if (string.IsNullOrWhiteSpace(request.Status))
            {
                throw new AppException("Status is required", 400);
            }

            var targetStatus = request.Status.ToLower().Trim();
            if (targetStatus != TrackingStatus.Confirmed &&
                targetStatus != TrackingStatus.Preparing &&
                targetStatus != TrackingStatus.Shipped &&
                targetStatus != TrackingStatus.Cancelled)
            {
                throw new AppException($"Invalid status update. Sellers can only update status to: '{TrackingStatus.Confirmed}', '{TrackingStatus.Preparing}', '{TrackingStatus.Shipped}', or '{TrackingStatus.Cancelled}'.", 400);
            }
        }
    }
}
