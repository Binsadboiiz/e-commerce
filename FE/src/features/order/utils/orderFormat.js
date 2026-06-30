export const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

export function formatDateTime(value) {
    if (!value) {
        return "--";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export function statusToLabel(status) {
    if (!status) {
        return "Unknown";
    }

    const map = {
        pending: "Pending Confirmation",
        confirmed: "Confirmed",
        preparing: "Preparing",
        shipped: "Shipped",
        in_transit: "In Transit",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        delivery_failed: "Delivery Failed",
        cancelled: "Cancelled"
    };

    return map[status] ?? status;
}
