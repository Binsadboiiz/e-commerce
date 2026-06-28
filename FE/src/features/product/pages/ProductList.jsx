import styles from './ProductList.module.css';

import { useSearchParams } from 'react-router-dom';

import useProducts from '../hooks/useProducts';

import ProductGrid from '../components/shared/ProductGrid';
import ProductSkeleton from '../components/shared/ProductSkeleton';

import SidebarFilter from '../components/list/filter/SidebarFilter';
import SortBar from '../components/list/sort/SortBar';
import Pagination from '../components/list/pagination/Pagination';

export default function ProductList() {

    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 20);

    const params = {
        search: searchParams.get("q") || "",

        minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : null,

        maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : null,

        categoryIds: searchParams
            .getAll("categoryIds")
            .map(Number)
            .filter(Boolean),

        minRating: searchParams.get("minRating")
            ? Number(searchParams.get("minRating"))
            : null,

        attributeValueIds: searchParams
            .getAll("attributeValueIds")
            .map(Number)
            .filter(Boolean),

        sortBy: searchParams.get("sortBy") || null,

        page,
        pageSize
    };

    const {
        products,
        loading,
        error,
        meta,
        pagination
    } = useProducts(params);

    console.log("PRODUCT LIST:", products);

    return (
        <div className={styles.container}>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <SidebarFilter filterMeta={meta} />
            </div>

            {/* CONTENT */}
            <div className={styles.content}>

                <SortBar
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />

                {/* LOADING */}
                {loading && (
                    <ProductSkeleton count={pageSize} />
                )}

                {/* ERROR */}
                {!loading && error && (
                    <p className={styles.error}>
                        Error: {error}
                    </p>
                )}

                {/* SUCCESS */}
                {!loading && !error && Array.isArray(products) && products.length > 0 && (
                    <>
                        <ProductGrid
                            products={products}
                        />

                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            total={pagination?.total || 0}
                        />
                    </>
                )}

                {/* EMPTY */}
                {!loading && !error && (!products || products.length === 0) && (
                    <p className={styles.empty}>
                        No products found
                    </p>
                )}

            </div>

        </div>
    );
}