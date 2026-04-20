import { currency } from "../utils/orderFormat";
import styles from "./TrackingPanels.module.css";

export default function OrderSummaryPanel({ summary }) {
    const items = summary?.items ?? [];

    return (
        <section className={`${styles.panel} p-5`}>
            <h2 className={styles.panelTitle}>Tóm tắt đơn hàng</h2>

            <div className="mt-4 space-y-2">
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Phương thức thanh toán</span>
                    <span className={styles.kvValue}>{summary?.paymentMethod || "--"}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Trạng thái thanh toán</span>
                    <span className={styles.kvValue}>{summary?.paymentStatus || "--"}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Tạm tính</span>
                    <span className={styles.kvValue}>{currency.format(summary?.merchandiseSubtotal || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Phí ship</span>
                    <span className={styles.kvValue}>{currency.format(summary?.shippingFee || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Giảm giá</span>
                    <span className={styles.kvValue}>-{currency.format(summary?.discountAmount || 0)}</span>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Thành tiền</span>
                    <span className={`${styles.kvValue} text-primary`}>{currency.format(summary?.finalAmount || 0)}</span>
                </div>
            </div>

            <div className={styles.itemRow}>
                <p className="mb-2 text-sm font-semibold text-slate-800">Sản phẩm ({items.length})</p>
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={`${item.productName}-${index}`} className="flex items-start justify-between gap-3 text-sm">
                            <div>
                                <p className="font-medium text-slate-800">{item.productName}</p>
                                <p className="text-xs text-slate-500">SL: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-slate-700">{currency.format((item.price || 0) * (item.quantity || 0))}</p>
                        </div>
                    ))}
                    {!items.length && <p className="text-sm text-slate-500">Không có dữ liệu sản phẩm.</p>}
                </div>
            </div>
        </section>
    );
}
