import styles from './ProductSkeleton.module.css';

/**
 * Skeleton placeholder cho product card grid.
 * @param {number} [count=8] - Số lượng card skeleton để render
 */
export default function ProductSkeleton({ count = 8 }) {
    return (
        <div className={styles.grid}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.image} />

                    <div className={styles.content}>
                        <div className={styles.lineLong} />
                        <div className={styles.lineShort} />

                        <div className={styles.priceRow}>
                            <div className={styles.linePrice} />
                            <div className={styles.circle} />
                        </div>

                        <div className={styles.lineMedium} />
                    </div>
                </div>
            ))}
        </div>
    );
}