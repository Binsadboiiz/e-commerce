import { useEffect, useState } from "react";
import { searchProducts } from "../services/productService";

/**
 * Custom hook quản lý:
 * - loading
 * - error
 * - filter business logic
 */

export default function useProducts({ search, category }) {
    
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] =  useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const data = await searchProducts({ search, category });
                
                //ẩn sp hết hàng ra khỏi product list
                const visibleProducts = data.filter(
                    (product) => product.stock > 0
                );

                setProducts(visibleProducts);
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [search, category]   
    );

    return {products, loading, error};

}