import styles from './ReviewSkeleton.module.css';

/* Single shimmer card — reused N times */
function ShimmerCard() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar} />
                <div className={styles.headerText}>
                    <div className={styles.name} />
                    <div className={styles.stars} />
                </div>
            </div>
            <div className={styles.line} />
            <div className={styles.lineShort} />
        </div>
    );
}

/* Renders 3 shimmer cards as placeholder */
export default function ReviewSkeleton() {
    return (
        <div className={styles.wrapper}>
            {Array.from({ length: 3 }).map((_, i) => (
                <ShimmerCard key={i} />
            ))}
        </div>
    );
}