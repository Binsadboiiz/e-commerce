import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import ProductSkeleton from '../components/ProductSkeleton';
import SidebarFilter from '../components/filter/SidebarFilter';
import SortBar from '../components/sort/SortBar';

import { ROUTES } from '@/config/route.config';

export default function ProductList() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const params = {
        search: searchParams.get("q") || "",

        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,

        categoryIds: searchParams.getAll("categoryIds").map(Number).filter(Boolean),

        minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null,

        attributeValueIds: searchParams.getAll("attributeValueIds").map(Number).filter(Boolean),

        sortBy: searchParams.get("sortBy") || null

    };

    const { products, loading, error } = useProducts(params);

    // TODO: move to product detail page
    // const handleBuyNow = (product) => {
    //     navigate(ROUTES.CHECKOUT, {
    //         state: {
    //             mode: 'buy-now',
    //             buyNow: {
    //                 productId: product.id,
    //                 quantity: 1,
    //                 paymentMethod: 'cod',
    //                 voucherCodes: []
    //             }
    //         }
    //     });
    // };

    return (
        <div className={styles.container}>

            <SidebarFilter />

            <div className={styles.content}>

                <SortBar
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />

                {loading && <ProductSkeleton />}

                {error && <p className={styles.error}>Error: {error}</p>}

                {!loading && !error && products.length > 0 && (
                    <ProductGrid products={products}
                    // onBuy={handleBuyNow} 
                    />
                )}

                {!loading && !error && products.length === 0 && (
                    <p className={styles.empty}>No products found</p>
                )}
            </div>

        </div>
    );
}
