import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import ProductSkeleton from '../components/ProductSkeleton';

export default function ProductList() {

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q") || "";

    const { products, loading, error } = useProducts({
        search: keyword,
        category: "All"
    });

    const safeProducts = Array.isArray(products) ? products : [];

    return (
        <div className={styles.wrapper}>

            {loading && <ProductSkeleton />}

            {error && <p className={styles.error}>Error: {error}</p>}

            {!loading && !error && safeProducts.length > 0 && (
                <ProductGrid products={safeProducts} />
            )}

            {!loading && !error && safeProducts.length === 0 && (
                <p className={styles.empty}>No products found</p>
            )}

        </div>
    );
}