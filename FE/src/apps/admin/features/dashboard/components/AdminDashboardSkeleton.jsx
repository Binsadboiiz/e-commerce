import Skeleton from "@/shared/components/ui/Skeleton";
import styles from "../pages/AdminDashboard.module.css";

export default function AdminDashboardSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Skeleton width={260} height={36} borderRadius={8} className="mb-2" />
                <Skeleton width={380} height={18} borderRadius={6} />
            </div>

            <div className={styles.cardGrid}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Skeleton width={140} height={18} borderRadius={6} />
                        </div>
                        <div className={styles.cardValue}>
                            <Skeleton width={70} height={44} borderRadius={8} />
                        </div>
                        <div className={styles.cardFooter}>
                            <Skeleton width={200} height={14} borderRadius={4} />
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <Skeleton width="100%" height={38} borderRadius={8} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
