import styles from './ProductDetailSkeleton.module.css';

export default function ProductDetailSkeleton() {
    return (
        <div className={styles.container}>

            {/*LEFT COL - image + thumbnail*/}
            <div className={styles.left}>
                <div className={styles.mainImage} />

                <div className={styles.thumbRow}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={styles.thumb} />
                    ))}
                </div>
            </div>

            {/*RIGHT COL - info + action*/}
            <div className={styles.right}>
                <div className={styles.title} />
                <div className={styles.price} />
                <div className={styles.rating} />
                <div className={styles.quantity} />
            </div>

        </div>
    );
}