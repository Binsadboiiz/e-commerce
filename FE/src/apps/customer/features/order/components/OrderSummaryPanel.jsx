import { currency } from "../utils/orderFormat";
import styles from "./TrackingPanels.module.css";

export default function OrderSummaryPanel({ summary }) {
    const items = summary?.items ?? [];

    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Order Summary</h2>

            <div className="mt-4 space-y-2">
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Payment Method</span>
                    <span className={styles.kvValue}>{summary?.paymentMethod || "--"}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Payment Status</span>
                    <span className={styles.kvValue}>{summary?.paymentStatus || "--"}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Subtotal</span>
                    <span className={styles.kvValue}>{currency.format(summary?.merchandiseSubtotal || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Shipping Fee</span>
                    <span className={styles.kvValue}>{currency.format(summary?.shippingFee || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Discount</span>
                    <span className={styles.kvValue}>-{currency.format(summary?.discountAmount || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Total Amount</span>
                    <span className={`${styles.kvValue} text-text-price`}>{currency.format(summary?.finalAmount || 0)}</span>
                </div>
            </div>

            <div className={styles.itemRow}>
                <p className="mb-2 text-sm font-semibold text-slate-800">Products ({items.length})</p>
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
                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-slate-700">{currency.format((item.price || 0) * (item.quantity || 0))}</p>
                        </div>
                    ))}
                    {!items.length && <p className="text-sm text-slate-500">No product data available.</p>}
                </div>
            </div>
        </section>
    );
}
