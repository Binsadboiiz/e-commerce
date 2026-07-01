import { formatDateTime } from "../utils/orderFormat";
import styles from "./TrackingPanels.module.css";

function Value({ children }) {
    return <span className={styles.kvValue}>{children || "--"}</span>;
}

export default function ShippingInfoPanel({ shipping, estimatedDeliveryDate }) {
    return (
        <section className={`${styles.panel} p-5`}>
            <h2 className={styles.panelTitle}>Shipping Information</h2>
            <div className="mt-4 space-y-2">
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Carrier</span>
                    <Value>{shipping?.carrier}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Tracking Number</span>
                    <Value>{shipping?.trackingCode}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Shipper</span>
                    <Value>{shipping?.shipperId}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Current Location</span>
                    <Value>{shipping?.currentLocation}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Estimated Delivery</span>
                    <Value>{formatDateTime(shipping?.estimatedDeliveryDate || estimatedDeliveryDate)}</Value>
                </div>
            </div>
        </section>
    );
}
