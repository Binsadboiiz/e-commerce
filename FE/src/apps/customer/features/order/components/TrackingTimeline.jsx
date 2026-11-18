import { formatDateTime, statusToLabel } from "../utils/orderFormat";
import styles from "./TrackingTimeline.module.css";

export default function TrackingTimeline({ timeline = [] }) {
    if (!timeline.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                No tracking data available for this order.
            </div>
        );
    }

    return (
        <div className={styles.timeline}>
            {timeline.map(event => {
                const dotClass = event.isCurrent
                    ? `${styles.dot} ${styles.dotCurrent}`
                    : event.isCompleted
                        ? `${styles.dot} ${styles.dotCompleted}`
                        : styles.dot;

                return (
                    <div key={event.id} className={styles.timelineItem}>
                        <span className={dotClass} />
                        <p className={styles.time}>{formatDateTime(event.timestamp)}</p>
                        <p className={event.isCompleted ? styles.title : `${styles.title} ${styles.titleMuted}`}>
                            {event.statusLabel || statusToLabel(event.status)}
                        </p>
                        {event.description && <p className={styles.description}>{event.description}</p>}
                        {event.location && <p className={styles.location}>Location: {event.location}</p>}
                    </div>
                );
            })}
        </div>
    );
}
