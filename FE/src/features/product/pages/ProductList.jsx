import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/shared/ProductGrid';
import ProductSkeleton from '../components/shared/ProductSkeleton';
import SidebarFilter from '../components/list/filter/SidebarFilter';
import SortBar from '../components/list/sort/SortBar';
import Pagination from '../components/list/pagination/Pagination';

import { ROUTES } from '@/config/route.config';

export default function ProductList() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 20);

    const params = {
        search: searchParams.get("q") || "",

        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,

        categoryIds: searchParams.getAll("categoryIds").map(Number).filter(Boolean),

        minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null,

        attributeValueIds: searchParams.getAll("attributeValueIds").map(Number).filter(Boolean),

        sortBy: searchParams.get("sortBy") || null,

        page: page,
        pageSize: pageSize
    };

    const { products, loading, error, meta, pagination } = useProducts(params);

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

    return (
        <div className={styles.container}>

            <div className={styles.sidebar}>
                <SidebarFilter filterMeta={meta} />
            </div>

            <div className={styles.content}>

                <SortBar
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />

                {loading && <ProductSkeleton />}

                {error && <p className={styles.error}>Error: {error}</p>}

                {!loading && !error && products.length > 0 && (
                    <>
                        <ProductGrid products={products} />

                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            total={pagination.total}
                        />
                    </>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className={styles.empty}>No products found</p>
                )}
            </div>

        </div>
    );

}