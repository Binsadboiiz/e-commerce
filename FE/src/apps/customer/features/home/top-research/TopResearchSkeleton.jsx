import styles from './TopResearch.module.css';
import skeletonStyles from '@/shared/components/ui/Skeleton.module.css';

/**
 * Skeleton placeholder cho TopResearch section.
 */
export default function TopResearchSkeleton({ count = 6 }) {
    return (
        <section className={styles.topResearchSection}>
            <div className={styles.topResearchContainer}>

                {/* Section title */}
                <div
                    className={skeletonStyles.skeleton}
                    style={{ width: 130, height: 22, marginBottom: 16 }}
                />

                <div className={styles.topResearchList}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className={styles.topResearchItem}>

                            {/* Ảnh (aspect-ratio 3/4 như thật) */}
                            <div
                                className={skeletonStyles.skeleton}
                                style={{ width: '100%', aspectRatio: '3 / 4', borderRadius: 8 }}
                            />

                            {/* Tên sản phẩm – 2 dòng */}
                            <div
                                className={skeletonStyles.skeleton}
                                style={{ width: '90%', height: 12, marginTop: 10 }}
                            />
                            <div
                                className={skeletonStyles.skeleton}
                                style={{ width: '60%', height: 12, marginTop: 6 }}
                            />

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
