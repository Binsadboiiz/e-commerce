import React from "react";
import { 
    CheckCircle2, 
    Clock, 
    PackageCheck, 
    Truck, 
    Home, 
    XCircle, 
    AlertCircle 
} from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./OrderStepsTracker.module.css";

const STEP_DEFINITIONS = [
    {
        key: "placed",
        labelKey: "orders.stepPlaced",
        sublabelKey: "orders.stepPlacedSub",
        icon: Clock,
        statuses: ["pending"]
    },
    {
        key: "confirmed",
        labelKey: "orders.stepConfirmed",
        sublabelKey: "orders.stepConfirmedSub",
        icon: PackageCheck,
        statuses: ["confirmed", "preparing"]
    },
    {
        key: "shipping",
        labelKey: "orders.stepInTransit",
        sublabelKey: "orders.stepInTransitSub",
        icon: Truck,
        statuses: ["shipped", "in_transit"]
    },
    {
        key: "out_for_delivery",
        labelKey: "orders.stepOutForDelivery",
        sublabelKey: "orders.stepOutForDeliverySub",
        icon: Truck,
        statuses: ["out_for_delivery"]
    },
    {
        key: "delivered",
        labelKey: "orders.stepDelivered",
        sublabelKey: "orders.stepDeliveredSub",
        icon: Home,
        statuses: ["delivered"]
    }
];

function getStepIndexForStatus(status) {
    if (!status) return 0;
    const lower = String(status).toLowerCase().trim().replace(/\s+|_/g, "");
    
    if (["cancelled", "canceled", "deliveryfailed", "failed"].includes(lower)) {
        return -1;
    }

    if (["delivered", "completed", "complete", "finished", "success"].includes(lower)) return 4;
    if (["outfordelivery", "delivering"].includes(lower)) return 3;
    if (["shipped", "intransit", "shipping"].includes(lower)) return 2;
    if (["confirmed", "preparing", "processing"].includes(lower)) return 1;
    return 0; // pending, waiting, orderplaced
}

export default function OrderStepsTracker({ currentStatus, estimatedDeliveryDate }) {
    const { t } = useLanguage();

    const isCancelled = currentStatus === "cancelled";
    const isFailed = currentStatus === "delivery_failed";
    const isAbnormal = isCancelled || isFailed;

    const currentStepIndex = getStepIndexForStatus(currentStatus);

    return (
        <div className={styles.trackerCard}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        {t("orders.orderProgress")}
                    </h3>
                    <p className={styles.subtitle}>
                        {isCancelled 
                            ? t("orders.orderCancelledDesc") 
                            : isFailed 
                                ? t("orders.deliveryFailedDesc") 
                                : t("orders.orderProgressSubtitle")}
                    </p>
                </div>
                {estimatedDeliveryDate && !isAbnormal && (
                    <div className={styles.deliveryBadge}>
                        <span className={styles.livePulse} />
                        <span>{t("orders.liveTracking")}</span>
                    </div>
                )}
            </div>

            {isAbnormal ? (
                <div className={`${styles.abnormalBanner} ${isCancelled ? styles.bannerCancelled : styles.bannerFailed}`}>
                    {isCancelled ? <XCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <div>
                        <div className="font-semibold text-sm">
                            {isCancelled ? t("orders.orderCancelledTitle") : t("orders.deliveryFailedTitle")}
                        </div>
                        <div className="text-xs opacity-90 mt-0.5">
                            {isCancelled 
                                ? t("orders.orderCancelledDesc")
                                : t("orders.deliveryFailedDesc")}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Stepper Bar */}
            <div className={styles.stepperContainer}>
                <div className={styles.stepper}>
                    {STEP_DEFINITIONS.map((step, idx) => {
                        const IconComponent = step.icon;
                        const isCompleted = currentStepIndex > idx || (currentStepIndex === 4 && idx === 4);
                        const isCurrent = currentStepIndex === idx;

                        let stepStateClass = styles.stepPending;
                        if (isCompleted) stepStateClass = styles.stepCompleted;
                        else if (isCurrent) stepStateClass = styles.stepCurrent;

                        return (
                            <div key={step.key} className={`${styles.stepItem} ${stepStateClass}`}>
                                {/* Connector line before */}
                                {idx > 0 && (
                                    <div 
                                        className={`${styles.connectorLine} ${styles.connectorLeft} ${
                                            currentStepIndex >= idx ? styles.connectorActive : ""
                                        }`} 
                                    />
                                )}

                                {/* Connector line after */}
                                {idx < STEP_DEFINITIONS.length - 1 && (
                                    <div 
                                        className={`${styles.connectorLine} ${styles.connectorRight} ${
                                            currentStepIndex > idx ? styles.connectorActive : ""
                                        }`} 
                                    />
                                )}

                                {/* Icon Circle */}
                                <div className={styles.iconWrapper}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <IconComponent className="w-5 h-5" />
                                    )}
                                    {isCurrent && !isAbnormal && currentStepIndex !== 4 && (
                                        <span className={styles.pulseRing} />
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className={styles.labelWrapper}>
                                    <span className={styles.stepTitle}>{t(step.labelKey)}</span>
                                    <span className={styles.stepSublabel}>{t(step.sublabelKey)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
