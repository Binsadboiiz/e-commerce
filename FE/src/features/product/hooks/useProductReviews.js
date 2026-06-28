import { useEffect, useState, useCallback } from "react";
import { reviewService } from "../services/reviewService";

export default function useProductReviews(productId) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");

    const pageSize = 10;

    const fetchReviews = useCallback(() => {
        if (!productId) return;

        setLoading(true);

        reviewService.getProductReviews(productId, {
            page,
            pageSize,
            sortBy
        })
        .then((res) => setData(res?.data ?? res))
        .finally(() => setLoading(false));

    }, [productId, page, sortBy]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const refresh = () => fetchReviews();

    return {
        data,
        loading,
        page,
        setPage,
        sortBy,
        setSortBy,
        refresh
    };
}