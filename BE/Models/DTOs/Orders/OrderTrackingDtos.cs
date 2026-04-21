namespace BE.Models.DTOs
{
    // ── Full tracking response for a single order ──
    public class OrderTrackingResponse
    {
        public long OrderId { get; set; }
        public string CurrentStatus { get; set; }
        public string? CurrentLocation { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime OrderDate { get; set; }
        public ShippingInfoDto? Shipping { get; set; }
        public List<TrackingEventDto> Timeline { get; set; } = new();
        public OrderSummaryDto OrderSummary { get; set; }
    }

    // ── Each event in the timeline ──
    public class TrackingEventDto
    {
        public long Id { get; set; }
        public string Status { get; set; }
        public string StatusLabel { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        /// <summary>Null when the step is a future milestone not yet reached.</summary>
        public DateTime? Timestamp { get; set; }
        public string? UpdatedBy { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsCurrent { get; set; }
    }

    // ── Shipping / carrier information ──
    public class ShippingInfoDto
    {
        public string? Carrier { get; set; }
        public string? TrackingCode { get; set; }
        public string? ShipperId { get; set; }
        public string? CurrentLocation { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
    }

    // ── Quick order summary (used inside tracking page) ──
    public class OrderSummaryDto
    {
        public long OrderId { get; set; }
        public decimal MerchandiseSubtotal { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public List<OrderItemSummaryDto> Items { get; set; } = new();
    }

    // ── Single item in order summary ──
    public class OrderItemSummaryDto
    {
        public string ProductName { get; set; }
        public string? ProductImage { get; set; }
        public string? VariantName { get; set; }
        public string? VariantValue { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    // ── Lightweight order card for "My Orders" list ──
    public class MyOrderDto
    {
        public long OrderId { get; set; }
        public string Status { get; set; }
        public string StatusLabel { get; set; }
        public decimal FinalAmount { get; set; }
        public int ItemCount { get; set; }
        public string? FirstItemName { get; set; }
        public string? FirstItemImage { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
    }

    // ── Request body to update order status (shop / admin) ──
    public class UpdateTrackingStatusRequest
    {
        public string Status { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public string? UpdatedBy { get; set; }
    }
}