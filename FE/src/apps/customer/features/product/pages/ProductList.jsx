import styles from './ProductList.module.css';

import { useSearchParams } from 'react-router-dom';

import useProducts from '../hooks/useProducts';

import ProductGrid from "../components/shared/ProductGrid";
import ProductSkeleton from "../components/shared/ProductSkeleton";

import SidebarFilter from "../components/list/filter/SidebarFilter";
import SortBar from "../components/list/sort/SortBar";
import Pagination from "../components/list/pagination/Pagination";
import SEOHead from "@/shared/components/SEOHead";
import { useLanguage } from "@/shared/context/LanguageContext";

export default function ProductList() {
    const { t } = useLanguage();
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

        brandIds: searchParams
            .getAll("brandIds")
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

    const searchQuery = searchParams.get("q") || "";

    const itemListJsonLd = Array.isArray(products) && products.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "numberOfItems": products.length,
        "itemListElement": products.map((prod, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": prod.name,
            "url": `${window.location.origin}/products/${prod.slug || prod.productId}`
        }))
    } : null;

    return (
        <div className={styles.container}>
            <SEOHead 
                title={searchQuery ? `Tìm kiếm: "${searchQuery}"` : "Danh Sách Sản Phẩm Tất Cả Nổi Bật"} 
                description="Khám phá bộ sưu tập sản phẩm đa dạng, chất lượng cao với giá cực tốt tại PolarisX Mall."
                isReady={!loading}
                statusCode={200}
                jsonLd={itemListJsonLd}
            />

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
                        {t('product.noProductsFound')}
                    </p>
                )}

            </div>

        </div>
    );
}