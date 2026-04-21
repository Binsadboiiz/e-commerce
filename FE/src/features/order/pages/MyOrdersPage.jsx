import { Link } from "react-router-dom";
import { ROUTES } from "../../../config/route.config";
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
                        <h1 className={styles.heading}>Đơn hàng của tôi</h1>
                        <p className={styles.subheading}>Theo dõi trạng thái và lịch sử mua hàng của bạn.</p>
                    </div>
                    <button
                        type="button"
                        onClick={refreshOrders}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Làm mới
                    </button>
                </header>

                {loading && <LoadingSkeleton />}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <p className="mb-3 text-sm">{error}</p>
                        <Link to={ROUTES.LOGIN} className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                            Đăng nhập lại
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className={styles.stateCard}>
                        <p>Bạn chưa có đơn hàng nào.</p>
                        <Link to={ROUTES.PRODUCTS} className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                            Mua sắm ngay
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
