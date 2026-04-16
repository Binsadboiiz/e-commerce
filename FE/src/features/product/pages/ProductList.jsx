import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import ProductSkeleton from '../components/ProductSkeleton';
import { ROUTES } from '../../../config/route.config';

export default function ProductList() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q") || "";

    const { products, loading, error } = useProducts({
        search: keyword,
        category: "All"
    });

    const safeProducts = Array.isArray(products) ? products : [];

    const handleBuyNow = (product) => {
        navigate(ROUTES.CHECKOUT, {
            state: {
                mode: 'buy-now',
                buyNow: {
                    productId: product.id,
                    quantity: 1,
                    paymentMethod: 'cod',
                    voucherCodes: []
                }
            }
        });
    };

    return (
        <div className={styles.wrapper}>

            {loading && <ProductSkeleton />}

            {error && <p className={styles.error}>Error: {error}</p>}

            {!loading && !error && safeProducts.length > 0 && (
                <ProductGrid products={safeProducts} onBuy={handleBuyNow} />
            )}

            {!loading && !error && safeProducts.length === 0 && (
                <p className={styles.empty}>No products found</p>
            )}

        </div>
    );
}