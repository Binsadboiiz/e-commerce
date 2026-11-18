import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { ArrowLeft, RotateCw, AlertTriangle, Package } from "lucide-react";
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
                        className={styles.buttonBack}
                    >
                        <ArrowLeft size={14} />
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={refreshTracking}
                        className={styles.buttonSecondary}
                    >
                        <RotateCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh Tracking
                    </button>
                </div>

                {loading && <LoadingSkeleton />}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <AlertTriangle size={32} className="mb-3 text-rose-500" />
                        <p className="mb-4 text-sm font-medium text-slate-600">{error}</p>
                        <Link to={ROUTES.MY_ORDERS} className={styles.buttonPrimary}>
                            <ArrowLeft size={14} className="mr-1.5" />
                            Back to Order List
                        </Link>
                    </div>
                )}

                {!loading && !error && tracking && (
                    <>
                        <header className={styles.hero}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-white/80" />
                                        <span className={styles.heroLabel}>Order Tracking</span>
                                    </div>
                                    <h1 className={styles.heroId}>#{tracking.orderId}</h1>
                                    <p className={styles.heroMeta}>
                                        Placed at: {formatDateTime(tracking.orderDate)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                                    <OrderStatusBadge
                                        status={tracking.currentStatus}
                                        label={statusToLabel(tracking.currentStatus)}
                                    />
                                    <p className="text-xs text-white/85 font-medium mt-1">
                                        Est. Delivery: {formatDateTime(tracking.estimatedDeliveryDate)}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className={styles.contentGrid}>
                            <section className={styles.panel}>
                                <h2 className={styles.panelTitle}>Status History</h2>
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
