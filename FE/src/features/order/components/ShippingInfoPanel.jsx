import { formatDateTime } from "../utils/orderFormat";
import styles from "./TrackingPanels.module.css";

function Value({ children }) {
    return <span className={styles.kvValue}>{children || "--"}</span>;
}

export default function ShippingInfoPanel({ shipping, estimatedDeliveryDate }) {
    return (
        <section className={`${styles.panel} p-5`}>
            <h2 className={styles.panelTitle}>Thông tin vận chuyển</h2>
            <div className="mt-4 space-y-2">
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Đơn vị vận chuyển</span>
                    <Value>{shipping?.carrier}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Mã vận đơn</span>
                    <Value>{shipping?.trackingCode}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Shipper</span>
                    <Value>{shipping?.shipperId}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Vị trí hiện tại</span>
                    <Value>{shipping?.currentLocation}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Dự kiến giao</span>
                    <Value>{formatDateTime(shipping?.estimatedDeliveryDate || estimatedDeliveryDate)}</Value>
                </div>
            </div>
        </section>
    );
}
