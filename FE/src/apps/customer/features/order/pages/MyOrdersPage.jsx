import { Link } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { RotateCw, ShoppingBag, AlertTriangle } from "lucide-react";
import useMyOrders from "../hooks/useMyOrders";
import OrderCard from "../components/OrderCard";
import styles from "./MyOrdersPage.module.css";

function LoadingSkeleton() {
    return (
        <div className="grid gap-4">
            {[1, 2, 3].map(item => (
                <div key={item} className="h-48 animate-pulse rounded-2xl bg-slate-200/70" />
            ))}
        </div>
    );
}

export default function MyOrdersPage() {
    const { orders, loading, error, refreshOrders } = useMyOrders();

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className={styles.heading}>My Orders</h1>
                        <p className={styles.subheading}>Track your order status and purchase history.</p>
                    </div>
                    <button
                        type="button"
                        onClick={refreshOrders}
                        className={styles.buttonSecondary}
                    >
                        <RotateCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </header>

                {loading && <LoadingSkeleton />}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <AlertTriangle size={32} className="mb-3 text-rose-500" />
                        <p className="mb-4 text-sm font-medium text-slate-600">{error}</p>
                        <Link to={ROUTES.LOGIN} className={styles.buttonPrimary}>
                            Log in again
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className={styles.stateCard}>
                        <ShoppingBag size={40} className="mb-3 text-slate-400" />
                        <p className="text-sm font-medium text-slate-600 mb-4">You have no orders yet.</p>
                        <Link to={ROUTES.PRODUCTS} className={styles.buttonPrimary}>
                            Shop now
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <section className="grid gap-4">
                        {orders.map(order => (
                            <OrderCard key={order.orderId} order={order} />
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}
