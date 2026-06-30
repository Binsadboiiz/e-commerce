import { useEffect, useState } from 'react';
import { productsService } from '../services/productService';

/**
 * Fetches products from the same category, excluding current product.
 * Used for the "Related Products" section on Product Detail page.
 */
export default function useRelatedProducts(categoryName, currentProductId) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!categoryName) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const res = await productsService.getProducts({
                    category: categoryName,
                    pageSize: 8,
                    page: 1,
                });

                if (cancelled) return;

                const items = res.data?.items ?? [];

                // Exclude current product from the list
                setProducts(
                    items.filter(p => p.productId !== currentProductId)
                );
            } catch {
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };

    }, [categoryName, currentProductId]);

    return { products, loading };
}
