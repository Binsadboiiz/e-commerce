namespace BE.Models.DTOs
{
    // ── Request DTOs ──
    public class AddToCartRequest
    {
        public long ProductId { get; set; }
        public long? VariantId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateCartRequest
    {
        public long ProductId { get; set; }
        public long? VariantId { get; set; }
        public int Quantity { get; set; }
    }

    public class RemoveCartItemRequest
    {
        public long ProductId { get; set; }
        public long? VariantId { get; set; }
    }

    // ── Response DTOs ──
    public class CartResponse
    {
        public long CartId { get; set; }
        public int TotalItems { get; set; }
        public decimal TotalPrice { get; set; }
        public List<CartShopGroup> ShopGroups { get; set; } = new();
    }

    public class CartShopGroup
    {
        public long ShopId { get; set; }
        public string ShopName { get; set; }
        public string ShopLogo { get; set; }
        public List<CartItemResponse> Items { get; set; } = new();
    }

    public class CartItemResponse
    {
        public long CartItemId { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImage { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int Quantity { get; set; }
        public int Stock { get; set; }
        public decimal SubTotal { get; set; }

        // Variant info
        public long? VariantId { get; set; }
        public string VariantName { get; set; }
        public string VariantValue { get; set; }
    }
}
