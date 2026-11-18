using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Shipping_Details")]
    public class ShippingDetail
    {
        [Key]
        public long Id { get; set; }
        public long OrderId { get; set; }
        public string? Carrier { get; set; }
        public string? TrackingCode { get; set; }
        public string? CurrentLocation { get; set; }
        public string? Status { get; set; }
        public string? ShipperId { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}