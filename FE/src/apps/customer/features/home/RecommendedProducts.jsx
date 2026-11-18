import useProducts from '@/apps/customer/features/product/hooks/useProducts';
import ProductGrid from '@/apps/customer/features/product/components/shared/ProductGrid';
import ProductSkeleton from '@/apps/customer/features/product/components/shared/ProductSkeleton';

export default function RecommendedProducts() {
    const { products, loading } = useProducts({
        params: { limit: 8 }
    });

    if (loading) return <ProductSkeleton count={8} />;

    return <ProductGrid products={products} />;
}