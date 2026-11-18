export const currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

export function formatDateTime(value, lang = "vi") {
    if (!value) {
        return "--";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    const locale = lang === "vi" ? "vi-VN" : "en-US";

    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export function statusToLabel(status, lang = "vi") {
    if (!status) {
        return lang === "vi" ? "Không xác định" : "Unknown";
    }

    const mapEn = {
        pending: "Pending Confirmation",
        confirmed: "Confirmed",
        preparing: "Preparing",
        processing: "Processing",
        shipped: "Shipped",
        in_transit: "In Transit",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        completed: "Completed",
        delivery_failed: "Delivery Failed",
        cancelled: "Cancelled"
    };

    const mapVi = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        preparing: "Đang chuẩn bị hàng",
        processing: "Đang xử lý",
        shipped: "Đã giao vận chuyển",
        in_transit: "Đang vận chuyển",
        out_for_delivery: "Đang giao hàng",
        delivered: "Giao hàng thành công",
        completed: "Đã hoàn thành",
        delivery_failed: "Giao hàng thất bại",
        cancelled: "Đã huỷ"
    };

    const map = lang === "vi" ? mapVi : mapEn;
    return map[status] ?? status;
}
