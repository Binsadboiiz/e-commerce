import { useEffect, useState, useCallback } from "react";

import { reviewService } from "../services/reviewService";
import {
    getReviewCache,
    setReviewCache,
    clearReviewCache
} from "../services/reviewCache";

export default function useProductReviews(productId) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");

    const pageSize = 10;

    const fetchReviews = useCallback(async () => {

        if (!productId) return;

        // Unique cache key for each product/page/sort
        const key = `${productId}-${page}-${pageSize}-${sortBy}`;

        // Return cached data if available
        const cached = getReviewCache(key);

        if (cached) {
            setData(cached);
            return;
        }

        setLoading(true);

        try {

            const res = await reviewService.getProductReviews(productId, {
                page,
                pageSize,
                sortBy
            });

            const response = res?.data ?? res;

            // Save latest response into cache
            setReviewCache(key, response);

            setData(response);

        } finally {

            setLoading(false);

        }

    }, [productId, page, pageSize, sortBy]);

    // Reload whenever dependencies change
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Force reload by clearing cache first
    const refresh = () => {

        clearReviewCache(productId);

        fetchReviews();

    };

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