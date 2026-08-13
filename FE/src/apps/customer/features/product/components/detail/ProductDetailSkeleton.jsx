import styles from './ProductDetailSkeleton.module.css';

export default function ProductDetailSkeleton() {
    return (
        <div className={styles.container}>

            {/* LEFT COL – ảnh chính + thumbnails */}
            <div className={styles.left}>
                <div className={styles.mainImage} />

                <div className={styles.thumbRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={styles.thumb} />
                    ))}
                </div>
            </div>

            {/* RIGHT COL – thông tin sản phẩm */}
            <div className={styles.right}>

                {/* Tên sản phẩm */}
                <div className={styles.title} />
                <div className={styles.titleShort} />

                {/* Giá */}
                <div className={styles.price} />

                {/* Rating */}
                <div className={styles.rating} />

                <div className={styles.divider} />

                {/* Variant label */}
                <div className={styles.variantLabel} />
                <div className={styles.variantRow}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={styles.variantChip} />
                    ))}
                </div>

                {/* Variant 2 */}
                <div className={styles.variantLabel} />
                <div className={styles.variantRow}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={styles.variantChip} />
                    ))}
                </div>

                <div className={styles.divider} />

                {/* Quantity + Buttons */}
                <div className={styles.qtyRow}>
                    <div className={styles.qtyBox} />
                    <div className={styles.btnPrimary} />
                    <div className={styles.btnSecondary} />
                </div>

            </div>

        </div>
    );
}