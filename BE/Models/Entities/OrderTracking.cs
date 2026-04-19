using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models.Entities
{
    [Table("Order_Tracking")]
    public class OrderTracking
    {
        [Key]
        public long OrderTrackingId { get; set; }
        public long OrderId { get; set; }
        public string Status { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}
