import styles from './RelatedProducts.module.css';
import useRelatedProducts from '../../../hooks/useRelatedProducts';
import ProductCard from '@/apps/customer/features/product/components/shared/ProductCard';

/* Shimmer placeholder for a single product card */
function RelatedSkeleton() {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonImg} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
        </div>
    );
}

export default function RelatedProducts({ categoryName, currentProductId }) {

    const { products, loading } = useRelatedProducts(categoryName, currentProductId);

    // Don't render the section at all if there's nothing to show
    if (!loading && products.length === 0) return null;

    return (
        <section className={styles.section}>

            <h2 className={styles.heading}>You May Also Like</h2>

            <div className={styles.grid}>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <RelatedSkeleton key={i} />
                    ))
                    : products.map(p => (
                        <ProductCard key={p.productId ?? p.slug} product={p} />
                    ))
                }
            </div>

        </section>
    );
}
