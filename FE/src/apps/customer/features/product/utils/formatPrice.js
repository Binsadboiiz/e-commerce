export default function formatPrice(value) {
    if (value == null) return "0 ₫";

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
}