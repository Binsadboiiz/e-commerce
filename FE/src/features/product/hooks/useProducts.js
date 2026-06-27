import { useEffect, useState } from "react";
import { productsService } from "../services/productService";

export default function useProducts(params) {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const [productsRes, metaRes] = await Promise.all([
                    productsService.getProducts(params),
                    productsService.getFilterMeta(params),
                ]);

                if(cancelled) return;

                setProducts(productsRes.data?.items ?? []);
                setMeta(metaRes.data ?? null);

                setPagination({
                    page: productsRes.data?.page ?? 1,
                    pageSize: productsRes.data?.pageSize ?? 20,
                    total: productsRes.data?.total ?? 0,
                    totalPages: productsRes.data?.totalPages ?? 0,
                });
            } catch (err) {
                if(!cancelled) {
                    setError(err.message ?? "Failed to fetch products");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [JSON.stringify(params)]);

    return { products, meta, pagination, loading, error };
}