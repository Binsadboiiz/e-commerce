import styles from './RelatedProducts.module.css';
import useRelatedProducts from '../../../hooks/useRelatedProducts';
import ProductCard from '@/apps/customer/features/product/components/shared/ProductCard';
import ProductSkeleton from '@/apps/customer/features/product/components/shared/ProductSkeleton';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function RelatedProducts({ categoryName, currentProductId }) {
    const { t } = useLanguage();

    const { products, loading } = useRelatedProducts(categoryName, currentProductId);

    // Don't render the section at all if there's nothing to show
    if (!loading && products.length === 0) return null;

    return (
        <section className={styles.section}>

            <h2 className={styles.heading}>{t('productDetail.youMayAlsoLike') || 'You May Also Like'}</h2>

            {loading ? (
                <ProductSkeleton count={4} wrapperClass={styles.grid} />
            ) : (
                <div className={styles.grid}>
                    {products.map(p => (
                        <ProductCard key={p.productId ?? p.slug} product={p} />
                    ))}
                </div>
            )}

        </section>
    );
}
