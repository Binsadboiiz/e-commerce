import styles from './ListCategory.module.css';
import skeletonStyles from '@/shared/components/ui/Skeleton.module.css';

/**
 * Skeleton placeholder cho ListCategory section.
 */
export default function ListCategorySkeleton({ count = 6 }) {
    return (
        <section className={styles.categorySection}>
            <div className={styles.categoryContainer}>

                {/* Section title */}
                <div
                    className={skeletonStyles.skeleton}
                    style={{ width: 120, height: 22, marginBottom: 16 }}
                />

                <div className={styles.categoryGrid}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className={skeletonStyles.skeleton}
                            style={{ height: 100, borderRadius: 8 }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
