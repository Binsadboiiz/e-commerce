export const currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
});

export function formatDateTime(value) {
    if (!value) {
        return "--";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
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
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        preparing: "Đang chuẩn bị",
        shipped: "Đã gửi hàng",
        in_transit: "Đang vận chuyển",
        out_for_delivery: "Đang giao",
        delivered: "Đã giao",
        delivery_failed: "Giao thất bại",
        cancelled: "Đã hủy"
    };

    return map[status] ?? status;
}
