import { useLanguage } from "@/shared/context/LanguageContext";
import { formatDateTime } from "../utils/orderFormat";
import styles from "./TrackingPanels.module.css";

function Value({ children }) {
    return <span className={styles.kvValue}>{children || "--"}</span>;
}

export default function ShippingInfoPanel({ shipping, estimatedDeliveryDate }) {
    const { t, lang } = useLanguage();

    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>{t("orders.shippingInfo")}</h2>
            <div className="mt-4 space-y-2">
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("orders.carrier")}</span>
                    <Value>{shipping?.carrier}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("orders.trackingCode")}</span>
                    <Value>{shipping?.trackingCode}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("orders.shipper")}</span>
                    <Value>{shipping?.shipperId}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("orders.currentLocation")}</span>
                    <Value>{shipping?.currentLocation}</Value>
                </div>
                <div className={styles.kvRow}>
                    <span className={styles.kvKey}>{t("orders.estDelivery")}</span>
                    <Value>{formatDateTime(shipping?.estimatedDeliveryDate || estimatedDeliveryDate, lang)}</Value>
                </div>
            </div>
        </section>
    );
}
