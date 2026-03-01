import styles from './ProductList.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../components/hooks/useProducts';
import SearchBar from '../components/common/SearchBar';
import ProductGird from '../components/product/ProductGrid';
import ProductSkeletion from '../components/product/ProductSkeletion';

export default function ProductList() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const keyword = searchParams.get("q") || "";

    const {products, loading, error} = useProducts({
        search: keyword,
        category: "All"
    });

    const handleSearch = (value) => {
        navigate(`/products?q=${value}`);
    };

    return (
        <div className={styles.wrapper}>
            <SearchBar onSearch={handleSearch} />

            {loading && <ProductSkeletion />}

            {error && <p>Error: {error}</p>}

            {!loading && !error && (
                <ProductGird products={products} />
            )}

            {!loading && products.length === 0 && (
                <p>No products found</p>
            )}

        </div>
    );
}