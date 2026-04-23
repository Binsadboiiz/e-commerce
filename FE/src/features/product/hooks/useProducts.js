import { useEffect, useState } from "react";
import { productsService } from "../services/productService";

export default function useProducts(params) {

    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
    });

    useEffect(() => {

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const [productRes, metaRes] = await Promise.all([
                    productsService.getProducts(params),
                    productsService.getFilterMeta(params)
                ]);

                setProducts(productRes.items || []);
                setMeta(metaRes);

                setPagination({
                    page: productRes.page,
                    pageSize: productRes.pageSize,
                    total: productRes.total,
                    totalPages: productRes.totalPages
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [JSON.stringify(params)]);

    return { products, meta, loading, error, total, pagination };
}