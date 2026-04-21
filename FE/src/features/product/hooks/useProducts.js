import { useEffect, useState } from "react";
import { productsService } from "../services/productService";

/**
 * Custom hook quản lý:
 * - loading
 * - error
 * - filter business logic
 */

export default function useProducts(params) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    console.log("PARAMS:", params);
    console.log("URL SEARCH:", window.location.search);

    useEffect(() => {
        async function fetchData() {
            if (!params) return;

            try {
                setLoading(true);
                setError(null);

                const res = await productsService.filterProducts(params);

                const items = Array.isArray(res) ? res : res?.items ?? [];

                setProducts(items);
                setTotal(res?.total ?? 0);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [JSON.stringify(params)]);

    return { products, loading, error, total };
}