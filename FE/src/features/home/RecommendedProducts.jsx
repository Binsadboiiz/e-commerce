import useProducts from '@/features/product/hooks/useProducts';
import ProductGrid from '@/features/product/components/ProductGrid';

export default function RecommendedProducts() {
    const { products, loading } = useProducts({
        params: { limit: 8 }
    });

    if (loading) return <p>Loading...</p>;

    return <ProductGrid products={products} />;
}