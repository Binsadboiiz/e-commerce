using BE.Models.Entities;

namespace BE.Helpers
{
    public static class PriceHelper
    {
        public static decimal GetUnitPrice(Product product, ProductVariant? variant)
            => variant?.Price ?? product.DiscountPrice ?? product.Price;
    }
}