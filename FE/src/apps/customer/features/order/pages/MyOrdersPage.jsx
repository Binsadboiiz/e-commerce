import { Link } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { RotateCw, ShoppingBag, AlertTriangle } from "lucide-react";
import SEOHead from "@/shared/components/SEOHead";
import { useLanguage } from "@/shared/context/LanguageContext";
import useMyOrders from "../hooks/useMyOrders";
import OrderCard from "../components/OrderCard";
import styles from "./MyOrdersPage.module.css";
import EmptyState from "@/shared/components/ui/EmptyState";

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
    const { t } = useLanguage();
    const { orders, loading, error, refreshOrders } = useMyOrders();

    return (
        <div className="customerPage">
            <SEOHead 
                title={t('orders.myOrders')} 
                description="Quản lý lịch sử đơn hàng và theo dõi trạng thái giao hàng."
            />
            <div className="customerContainer">
                <header className="customerHeader">
                    <div className="customerTitleSection">
                        <h1 className="customerPageTitle">{t('orders.myOrders')}</h1>
                        <p className="customerPageSubtitle">{t('orders.trackSubheading')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={refreshOrders}
                        className="customerBtnTextAction"
                    >
                        <RotateCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>{t('orders.refresh')}</span>
                    </button>
                </header>

                {loading && <LoadingSkeleton />}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <AlertTriangle size={32} className="mb-3 text-rose-500" />
                        <p className="mb-4 text-sm font-medium text-slate-600">{error}</p>
                        <Link to={ROUTES.LOGIN} className={styles.buttonPrimary}>
                            {t('orders.logInAgain')}
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <EmptyState
                        icon={<ShoppingBag size={36} />}
                        title={t('orders.noOrders') || "Bạn chưa có đơn hàng nào"}
                        description={t('orders.noOrdersSubtitle') || "Các đơn hàng của bạn sẽ xuất hiện tại đây sau khi đặt hàng."}
                        actionText={t('orders.shopNow') || "Khám Phá Ngay"}
                        actionLink={ROUTES.PRODUCTS_LIST || "/products"}
                    />
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

