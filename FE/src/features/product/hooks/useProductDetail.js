import { useEffect, useState } from "react";
import { productsService } from "../services/productService";

export default function useProductDetail(slug) {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        setLoading(true);

        productsService.getProductDetail(slug)
            .then((res) => {
                console.log("PRODUCT DETAIL RESPONSE:", res);
                setProduct(res);
            })
            .catch((err) => {
                console.error("GET PRODUCT DETAIL ERROR:", err);
                setProduct(null);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [slug]);

    return { product, loading };
}