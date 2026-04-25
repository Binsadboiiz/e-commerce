import styles from './ProductSkeleton.module.css';

export default function ProductSkeleton() {
    return (
        <div className={styles.card}>
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
    );
}