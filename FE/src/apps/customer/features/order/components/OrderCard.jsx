import { Link } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { ArrowRight } from "lucide-react";
import { currency, formatDateTime } from "../utils/orderFormat";
import OrderStatusBadge from "./OrderStatusBadge";
import styles from "./OrderCard.module.css";

function buildTrackingPath(orderId) {
    return ROUTES.ORDER_TRACKING.replace(":orderId", String(orderId));
}

export default function OrderCard({ order }) {
    return (
        <article className={styles.card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500">Order ID</p>
                    <h3 className="text-lg font-bold text-slate-900">#{order.orderId}</h3>
                </div>
                <OrderStatusBadge status={order.status} label={order.statusLabel} />
            </div>

            <div className="mt-4 flex gap-4">
                {order.firstItemImage ? (
                    <img src={order.firstItemImage} alt={order.firstItemName || "Product"} className={styles.thumb} />
                ) : (
                    <div className={styles.thumbPlaceholder}>No image</div>
                )}

                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {order.firstItemName || "Your order"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Total items: {order.itemCount}</p>
                </div>
            </div>

            <div className={styles.metaGrid}>
                <div>
                    <p className={styles.metaLabel}>Order date</p>
                    <p className={styles.metaValue}>{formatDateTime(order.orderDate)}</p>
                </div>
                <div>
                    <p className={styles.metaLabel}>Est. delivery</p>
                    <p className={styles.metaValue}>{formatDateTime(order.estimatedDeliveryDate)}</p>
                </div>
                <div>
                    <p className={styles.metaLabel}>Payment</p>
                    <p className={`${styles.metaValue} text-[#ee4d2d]`}>{currency.format(order.finalAmount || 0)}</p>
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <Link
                    to={buildTrackingPath(order.orderId)}
                    className={styles.buttonPrimary}
                >
                    Track Order
                    <ArrowRight size={14} />
                </Link>
            </div>
        </article>
    );
}
