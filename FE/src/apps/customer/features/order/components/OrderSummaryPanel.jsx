import { useLanguage } from "@/shared/context/LanguageContext";
import { currency } from "../utils/orderFormat";
import styles from "./TrackingPanels.module.css";

export default function OrderSummaryPanel({ summary }) {
    const { t } = useLanguage();
    const items = summary?.items ?? [];

    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>{t("orders.orderSummary")}</h2>

            <div className="mt-4 space-y-2">
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("checkout.paymentMethod") || "Phương thức thanh toán"}</span>
                    <span className={styles.kvValue}>{summary?.paymentMethod || "--"}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("orders.orderStatus") || "Trạng thái"}</span>
                    <span className={styles.kvValue}>{summary?.paymentStatus || "--"}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("checkout.totalProductPrice") || "Tiền hàng"}</span>
                    <span className={styles.kvValue}>{currency.format(summary?.merchandiseSubtotal || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("checkout.shippingFee") || "Phí vận chuyển"}</span>
                    <span className={styles.kvValue}>{currency.format(summary?.shippingFee || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("checkout.discountAmount") || "Giảm giá"}</span>
                    <span className={styles.kvValue}>-{currency.format(summary?.discountAmount || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("checkout.grandTotal") || "Tổng thanh toán"}</span>
                    <span className={`${styles.kvValue} text-text-price`}>{currency.format(summary?.finalAmount || 0)}</span>
                </div>
            </div>

            <div className={styles.itemRow}>
                <p className="mb-2 text-sm font-semibold text-slate-800">
                    {t("orders.productsCount", { count: items.length })}
                </p>
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={`${item.productName}-${index}`} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-slate-100 last:border-none">
                            <div className="flex items-center gap-3">
                                {item.productImage ? (
                                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-medium">No img</div>
                                )}
                                <div>
                                    <p className="font-medium text-slate-800">{item.productName}</p>
                                    {(item.variantName || item.variantValue) && (
                                        <p className="text-xs text-slate-400">{item.variantName}: {item.variantValue}</p>
                                    )}
                                    <p className="text-xs text-slate-500">{t("orders.totalItems")} {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-slate-700">{currency.format((item.price || 0) * (item.quantity || 0))}</p>
                        </div>
                    ))}
                    {!items.length && <p className="text-sm text-slate-500">{t("orders.noProductsData")}</p>}
                </div>
            </div>
        </section>
    );
}
