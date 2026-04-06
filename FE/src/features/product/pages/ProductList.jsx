import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../../product/hooks/useProducts';
import ProductGird from '../../product/components/ProductGrid';
import ProductSkeletion from '../../product/components/ProductSkeletion';

export default function ProductList() {

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("q") || "";

    const {products, loading, error} = useProducts({
        search: keyword,
        category: "All"
    }); 

    return (
        <div className={styles.wrapper}>
            
            {loading && <ProductSkeletion />}

            {error && <p className={styles.error}>Error: {error} </p>}

            {!loading && !error && products.length > 0 && (
                <ProductGird products={products} />
            )}

            {!loading && !error && products.length === 0 && (
                <p className={styles.empty}>No products found</p>
            )}

        </div>
    );
}