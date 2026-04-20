import { Link } from "react-router-dom";
import { ROUTES } from "../../../config/route.config";
import { currency, formatDateTime } from "../utils/orderFormat";
import OrderStatusBadge from "./OrderStatusBadge";
import styles from "./OrderCard.module.css";

function buildTrackingPath(orderId) {
    return ROUTES.ORDER_TRACKING.replace(":orderId", String(orderId));
}

export default function OrderCard({ order }) {
    return (
        <article className={`${styles.card} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500">Mã đơn hàng</p>
                    <h3 className="text-lg font-bold text-slate-900">#{order.orderId}</h3>
                </div>
                <OrderStatusBadge status={order.status} label={order.statusLabel} />
            </div>

            <div className="mt-4 flex gap-4">
                {order.firstItemImage ? (
                    <img src={order.firstItemImage} alt={order.firstItemName || "Sản phẩm"} className={styles.thumb} />
                ) : (
                    <div className={styles.thumbPlaceholder}>No image</div>
                )}

                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {order.firstItemName || "Đơn hàng của bạn"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Tổng sản phẩm: {order.itemCount}</p>
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                    <p className={styles.metaLabel}>Ngày đặt</p>
                    <p className={styles.metaValue}>{formatDateTime(order.orderDate)}</p>
                </div>
                <div>
                    <p className={styles.metaLabel}>Dự kiến giao</p>
                    <p className={styles.metaValue}>{formatDateTime(order.estimatedDeliveryDate)}</p>
                </div>
                <div>
                    <p className={styles.metaLabel}>Thanh toán</p>
                    <p className={`${styles.metaValue} text-primary`}>{currency.format(order.finalAmount || 0)}</p>
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <Link
                    to={buildTrackingPath(order.orderId)}
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                    Theo dõi đơn hàng
                </Link>
            </div>
        </article>
    );
}
