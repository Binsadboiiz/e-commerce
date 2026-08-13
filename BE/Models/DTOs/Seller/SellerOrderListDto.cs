namespace BE.Models.DTOs.Seller
{
    public class SellerOrderListDto
    {
         public long OrderId { get; set; }

        public string? CustomerName { get; set; }

        public int ItemCount { get; set; }

        public decimal SellerTotal { get; set; }

        public string? PaymentMethod { get; set; }

        public string? PaymentStatus { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Status { get; set; } = null!;
    }

    public class SellerOrderItemDto
    {
        public long Id { get; set; }

        public long ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public string? ProductImage { get; set; }

        public string? VariantName { get; set; }

        public string? VariantValue { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public decimal Subtotal => Price * Quantity;

        public string Status { get; set; } = null!;
    }

    public class SellerOrderDetailDto
    {
        public long OrderId { get; set; }

        public string? CustomerName { get; set; }

        public string? PaymentMethod { get; set; }

        public string? PaymentStatus { get; set; }

        public DateTime CreatedAt { get; set; }

        public decimal SellerTotal { get; set; }

        public List<SellerOrderItemDto> Items { get; set; } = [];
    }

    public class SellerOrderTrackingDto
    {
        public string Status { get; set; } = null!;

        public string? Location { get; set; }

        public string? Description { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public class UpdateSellerOrderStatusRequest
    {
        public string Status { get; set; } = null!;
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}