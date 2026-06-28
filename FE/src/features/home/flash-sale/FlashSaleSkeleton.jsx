import styles from './FlashSale.module.css';
import skeletonStyles from '@/components/ui/Skeleton.module.css';

/**
 * Skeleton placeholder cho FlashSale section.
 * Giữ nguyên section/container wrapper để layout không bị giật.
 */
export default function FlashSaleSkeleton({ count = 8 }) {
    return (
        <section className={styles.flashSaleSection}>
            <div className={styles.flashSaleContainer}>

                {/* Header skeleton */}
                <div className={styles.flashSaleHeader}>
                    <div
                        className={skeletonStyles.skeleton}
                        style={{ width: 100, height: 22 }}
                    />
                    <div
                        className={skeletonStyles.skeleton}
                        style={{ width: 72, height: 22, borderRadius: 4 }}
                    />
                </div>

                {/* Items skeleton */}
                <div className={styles.flashSaleList}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className={styles.flashSaleItem} style={{ pointerEvents: 'none' }}>

                            {/* Ảnh */}
                            <div
                                className={skeletonStyles.skeleton}
                                style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 6 }}
                            />

                            {/* Progress label */}
                            <div
                                className={skeletonStyles.skeleton}
                                style={{ width: '60%', height: 12 }}
                            />

                            {/* Progress bar */}
                            <div
                                className={skeletonStyles.skeleton}
                                style={{ width: '100%', height: 8, borderRadius: 999 }}
                            />

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
