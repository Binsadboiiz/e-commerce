import React from "react";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./OrderMiniTracker.module.css";

const MINI_STEPS = [
    { key: "pending", labelKey: "orders.stepPlaced" },
    { key: "confirmed", labelKey: "orders.stepConfirmed" },
    { key: "in_transit", labelKey: "orders.stepInTransit" },
    { key: "out_for_delivery", labelKey: "orders.stepOutForDelivery" },
    { key: "delivered", labelKey: "orders.stepDelivered" }
];

function getMiniStepIndex(status) {
    if (!status) return 0;
    const lower = String(status).toLowerCase().trim().replace(/\s+|_/g, "");
    if (["cancelled", "canceled", "deliveryfailed", "failed"].includes(lower)) return -1;
    if (["delivered", "completed", "complete", "finished", "success"].includes(lower)) return 4;
    if (["outfordelivery", "delivering"].includes(lower)) return 3;
    if (["shipped", "intransit", "shipping"].includes(lower)) return 2;
    if (["confirmed", "preparing", "processing"].includes(lower)) return 1;
    return 0; // pending
}

export default function OrderMiniTracker({ status }) {
    const { t } = useLanguage();
    const isCancelled = status === "cancelled";
    const isFailed = status === "delivery_failed";
    const isAbnormal = isCancelled || isFailed;

    if (isAbnormal) {
        return (
            <div className={styles.abnormalBox}>
                <span className={styles.abnormalDot} />
                <span>{isCancelled ? t("orders.orderCancelledTitle") : t("orders.deliveryFailedTitle")}</span>
            </div>
        );
    }

    const currentIdx = getMiniStepIndex(status);

    return (
        <div className={styles.miniTracker}>
            <div className={styles.trackLineBg}>
                <div 
                    className={styles.trackLineFill} 
                    style={{ width: `${(Math.max(0, currentIdx) / (MINI_STEPS.length - 1)) * 100}%` }}
                />
            </div>
            <div className={styles.stepsRow}>
                {MINI_STEPS.map((step, idx) => {
                    const isCompleted = currentIdx > idx;
                    const isCurrent = currentIdx === idx;

                    let dotClass = styles.dotPending;
                    if (isCompleted) dotClass = styles.dotCompleted;
                    if (isCurrent) dotClass = styles.dotCurrent;

                    return (
                        <div key={step.key} className={styles.stepCol}>
                            <div className={`${styles.dot} ${dotClass}`}>
                                {isCurrent && <span className={styles.pulse} />}
                            </div>
                            <span className={`${styles.label} ${isCurrent ? styles.labelCurrent : isCompleted ? styles.labelCompleted : ""}`}>
                                {t(step.labelKey)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
