using System.ComponentModel.DataAnnotations;

namespace BE.Models.DTOs
{
    public class CheckoutPreviewRequest
    {
        [Required]
        public long AddressId { get; set; }

        [Required]
        public string PaymentMethod { get; set; }

        // Checkout from cart only uses the selected cart item ids.
        public List<long> CartItemIds { get; set; } = new();

        public List<string> VoucherCodes { get; set; } = new();
    }

    public class CheckoutPlaceOrderRequest : CheckoutPreviewRequest
    {
    }

    public class CheckoutItemDto
    {
        public long ProductId { get; set; }
        public long ShopId { get; set; }
        public long? VariantId { get; set; }
        public string ProductName { get; set; }
        public string? ProductImage { get; set; }
        public string? VariantName { get; set; }
        public string? VariantValue { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class CheckoutAddressDto
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
        public string StreetName { get; set; }
        public string HouseNo { get; set; }
        public bool IsDefault { get; set; }
    }

    public class CheckoutPreviewResponse
    {
        public string CheckoutType { get; set; }
        public string PaymentMethod { get; set; }
        public CheckoutAddressDto Address { get; set; }
        public List<CheckoutItemDto> Items { get; set; } = new();
        public List<string> AppliedVoucherCodes { get; set; } = new();
        public decimal MerchandiseSubtotal { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
    }

    public class PlaceOrderResponse
    {
        public long OrderId { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        public decimal FinalAmount { get; set; }
    }
}