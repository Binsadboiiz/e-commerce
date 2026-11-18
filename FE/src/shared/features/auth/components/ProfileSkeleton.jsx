import Skeleton from "@/shared/components/ui/Skeleton";
import styles from "../pages/ProfilePage.module.css";

export default function ProfileSkeleton() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.titleSection}>
                    <Skeleton width={180} height={30} borderRadius={8} />
                    <Skeleton width={320} height={16} borderRadius={6} />
                </div>

                <div className={styles.card}>
                    <div className={styles.banner}></div>
                    <div className={styles.profileContent}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatarContainer}>
                                <Skeleton width={120} height={120} borderRadius="50%" />
                            </div>
                        </div>

                        <div className={styles.headerInfo}>
                            <Skeleton width={180} height={26} borderRadius={6} className="mx-auto mb-2" />
                            <Skeleton width={90} height={24} borderRadius={12} className="mx-auto" />
                        </div>

                        <div className={styles.detailsGrid}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={styles.detailCard}>
                                    <Skeleton width={44} height={44} borderRadius={10} />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton width={100} height={14} borderRadius={4} />
                                        <Skeleton width={160} height={18} borderRadius={4} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
