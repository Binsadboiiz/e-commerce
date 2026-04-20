import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../config/route.config";
import useOrderTracking from "../hooks/useOrderTracking";
import { formatDateTime, statusToLabel } from "../utils/orderFormat";
import OrderStatusBadge from "../components/OrderStatusBadge";
import TrackingTimeline from "../components/TrackingTimeline";
import ShippingInfoPanel from "../components/ShippingInfoPanel";
import OrderSummaryPanel from "../components/OrderSummaryPanel";
import styles from "./OrderTrackingPage.module.css";

function LoadingSkeleton() {
    return (
        <div className="grid gap-4">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="h-80 animate-pulse rounded-2xl bg-slate-200/70" />
        </div>
    );
}

export default function OrderTrackingPage() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { tracking, loading, error, refreshTracking } = useOrderTracking(orderId);

    const timeline = tracking?.timeline ?? [];
    const summary = tracking?.orderSummary ?? null;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Quay lại
                    </button>
                    <button
                        type="button"
                        onClick={refreshTracking}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Làm mới tracking
                    </button>
                </div>

                {loading && <LoadingSkeleton />}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <p className="mb-3 text-sm">{error}</p>
                        <Link to={ROUTES.MY_ORDERS} className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                            Quay lại danh sách đơn hàng
                        </Link>
                    </div>
                )}

                {!loading && !error && tracking && (
                    <>
                        <header className={styles.hero}>
                            <p className={styles.heroLabel}>Theo dõi đơn hàng</p>
                            <h1 className={styles.heroId}>#{tracking.orderId}</h1>
                            <div className="mt-2">
                                <OrderStatusBadge
                                    status={tracking.currentStatus}
                                    label={statusToLabel(tracking.currentStatus)}
                                />
                            </div>
                            <p className={styles.heroMeta}>
                                Đặt lúc: {formatDateTime(tracking.orderDate)} - Dự kiến giao: {formatDateTime(tracking.estimatedDeliveryDate)}
                            </p>
                        </header>

                        <div className={styles.contentGrid}>
                            <section className={`${styles.panel} p-5`}>
                                <h2 className={styles.panelTitle}>Lịch sử trạng thái</h2>
                                <TrackingTimeline timeline={timeline} />
                            </section>

                            <div className="space-y-4">
                                <ShippingInfoPanel
                                    shipping={tracking.shipping}
                                    estimatedDeliveryDate={tracking.estimatedDeliveryDate}
                                />
                                <OrderSummaryPanel summary={summary} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
