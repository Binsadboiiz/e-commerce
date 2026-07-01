import { useNavigate } from 'react-router-dom';
import styles from './RelatedProducts.module.css';
import useRelatedProducts from '../../../hooks/useRelatedProducts';
import { ROUTES } from '@/config/route.config';

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

/* Single related product card */
function RelatedCard({ product }) {
    const navigate = useNavigate();

    const discountPct = product.price && product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    const handleClick = () => {
        navigate(ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug));
        // Scroll to top so user sees the new product from the beginning
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            type="button"
            className={styles.card}
            onClick={handleClick}
            aria-label={`View ${product.name}`}
        >
            <div className={styles.imageWrapper}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={styles.image}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.imagePlaceholder} />
                )}

                {discountPct > 0 && (
                    <span className={styles.badge}>-{discountPct}%</span>
                )}
            </div>

            <div className={styles.info}>
                <p className={styles.name}>{product.name}</p>
                <div className={styles.priceRow}>
                    <span className={`${styles.price} ${product.discountPrice ? styles.salePrice : ''}`}>
                        ${(product.discountPrice ?? product.price ?? 0).toFixed(2)}
                    </span>
                    {product.discountPrice && (
                        <span className={styles.originalPrice}>
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </button>
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
                        <RelatedCard key={p.productId ?? p.slug} product={p} />
                    ))
                }
            </div>

        </section>
    );
}
