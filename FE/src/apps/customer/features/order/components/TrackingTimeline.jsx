import React from "react";
import { 
    Clock, 
    CheckCircle2, 
    Truck, 
    Package, 
    MapPin, 
    AlertCircle, 
    XCircle,
    Calendar,
    Radio
} from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { formatDateTime, statusToLabel } from "../utils/orderFormat";
import styles from "./TrackingTimeline.module.css";

// Map status to semantic icon and color theme
function getStatusVisuals(status, isCompleted, isCurrent) {
    const s = String(status || "").toLowerCase();

    if (s === "cancelled") {
        return {
            icon: XCircle,
            badgeClass: styles.badgeCancelled,
            colorText: "text-rose-600"
        };
    }
    if (s === "delivery_failed") {
        return {
            icon: AlertCircle,
            badgeClass: styles.badgeFailed,
            colorText: "text-amber-600"
        };
    }
    if (s === "delivered" || s === "completed") {
        return {
            icon: CheckCircle2,
            badgeClass: styles.badgeDelivered,
            colorText: "text-emerald-600"
        };
    }
    if (s === "out_for_delivery" || s === "in_transit" || s === "shipped") {
        return {
            icon: Truck,
            badgeClass: isCurrent ? styles.badgeActive : styles.badgeCompleted,
            colorText: "text-blue-600"
        };
    }
    if (s === "preparing" || s === "confirmed") {
        return {
            icon: Package,
            badgeClass: isCurrent ? styles.badgeActive : styles.badgeCompleted,
            colorText: "text-indigo-600"
        };
    }
    // pending or default
    return {
        icon: Clock,
        badgeClass: isCurrent ? styles.badgeActive : styles.badgeDefault,
        colorText: "text-slate-600"
    };
}

export default function TrackingTimeline({ timeline = [], currentStatus = "" }) {
    const { t, lang } = useLanguage();

    if (!timeline.length) {
        return (
            <div className={styles.emptyCard}>
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">
                    {t("orders.noTrackingData")}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                    {t("orders.noTrackingDataSubtitle")}
                </p>
            </div>
        );
    }

    // Determine the exact index of the single CURRENT event
    // 1. If an event has event.isCurrent === true, use it.
    // 2. Otherwise match event.status against order's currentStatus.
    // 3. Otherwise default to the last item in chronological list.
    const normalizedCurrentStatus = String(currentStatus || "").toLowerCase().trim().replace(/\s+|_/g, "");
    
    let activeIdx = timeline.findIndex(e => Boolean(e.isCurrent));
    if (activeIdx === -1 && normalizedCurrentStatus) {
        activeIdx = timeline.findLastIndex ? 
            timeline.findLastIndex(e => String(e.status || "").toLowerCase().trim().replace(/\s+|_/g, "") === normalizedCurrentStatus) :
            timeline.map(e => String(e.status || "").toLowerCase().trim().replace(/\s+|_/g, "")).lastIndexOf(normalizedCurrentStatus);
    }
    if (activeIdx === -1) {
        // Fallback to the last event in chronological list
        activeIdx = timeline.length - 1;
    }

    return (
        <div className={styles.timelineWrapper}>
            <div className={styles.timeline}>
                {timeline.map((event, idx) => {
                    const isLast = idx === timeline.length - 1;
                    const isCurrent = idx === activeIdx;
                    const isCompleted = idx <= activeIdx || Boolean(event.isCompleted);

                    const { icon: EventIcon, badgeClass } = getStatusVisuals(event.status, isCompleted, isCurrent);

                    return (
                        <div 
                            key={event.id || `${event.status}-${idx}`} 
                            className={`${styles.timelineItem} ${isCurrent ? styles.itemCurrent : ""}`}
                        >
                            {/* Track line connector */}
                            {!isLast && (
                                <div className={`${styles.line} ${idx < activeIdx ? styles.lineActive : ""}`} />
                            )}

                            {/* Node icon with glowing animation for current step */}
                            <div className={`${styles.nodeIconWrapper} ${badgeClass}`}>
                                <EventIcon className="w-4 h-4" />
                                {isCurrent && <span className={styles.rippleEffect} />}
                            </div>

                            {/* Event details card */}
                            <div className={styles.contentCard}>
                                <div className={styles.headerRow}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className={styles.eventTitle}>
                                            {event.statusLabel || statusToLabel(event.status, lang)}
                                        </h4>
                                        {isCurrent && (
                                            <span className={styles.currentPill}>
                                                <Radio className="w-3 h-3 animate-pulse" />
                                                {t("orders.currentStatusBadge")}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.timeTag}>
                                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>{formatDateTime(event.timestamp, lang)}</span>
                                    </div>
                                </div>

                                {event.description && (
                                    <p className={styles.description}>
                                        {event.description}
                                    </p>
                                )}

                                {event.location && (
                                    <div className={styles.metaBadge}>
                                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
