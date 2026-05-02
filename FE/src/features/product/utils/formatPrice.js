export default function formatPrice(value) {
    if (value == null) return "$0.00";

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}