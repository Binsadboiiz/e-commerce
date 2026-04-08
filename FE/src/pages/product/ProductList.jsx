import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../../features/product/hooks/useProducts';
import ProductGrid from '../../features/product/components/ProductGrid';
import ProductSkeleton from '../../features/product/components/ProductSkeleton';

export default function ProductList() {

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("q") || "";

    const { products, loading, error } = useProducts({
        search: keyword,
        category: "All"
    });

    const safeProducts = products || []

    return (
        <div className={styles.wrapper}>

            {loading && <ProductSkeleton />}

            {error && <p className={styles.error}>Error: {error} </p>}

            {
                !loading && !error && safeProducts.length > 0 && (
                    <ProductGrid products={safeProducts} />
                )
            }

            {!loading && !error && products.length === 0 && (
                <p className={styles.empty}>No products found</p>
            )}



        </div>
    );
}