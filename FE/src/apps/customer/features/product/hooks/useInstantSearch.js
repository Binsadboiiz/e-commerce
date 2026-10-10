import { useState, useEffect, useRef, useCallback } from "react";
import { productsService } from "../services/productService";

const RECENT_SEARCHES_KEY = "polaris_recent_searches";
const MAX_RECENT_SEARCHES = 6;

export function useInstantSearch(delay = 250) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState({
        categories: [],
        brands: [],
        products: [],
        keywords: []
    });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const abortControllerRef = useRef(null);
    const cacheRef = useRef(new Map());

    // Lưu từ khóa vào danh sách tìm kiếm gần đây
    const saveRecentSearch = useCallback((keyword) => {
        const trimmed = keyword?.trim();
        if (!trimmed) return;

        setRecentSearches((prev) => {
            const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
            const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
            try {
                localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Error saving recent searches", e);
            }
            return updated;
        });
    }, []);

    const removeRecentSearch = useCallback((keyword) => {
        setRecentSearches((prev) => {
            const updated = prev.filter((item) => item !== keyword);
            try {
                localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Error removing recent search", e);
            }
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        try {
            localStorage.removeItem(RECENT_SEARCHES_KEY);
        } catch (e) {
            console.error("Error clearing recent searches", e);
        }
    }, []);

    useEffect(() => {
        const trimmedQuery = query.trim();

        // Nếu từ khóa rỗng hoặc chỉ có 1 ký tự, không gọi API
        if (trimmedQuery.length < 2) {
            setSuggestions({ categories: [], brands: [], products: [], keywords: [] });
            setLoading(false);
            return;
        }

        // Kiểm tra in-memory cache
        const cacheKey = trimmedQuery.toLowerCase();
        if (cacheRef.current.has(cacheKey)) {
            setSuggestions(cacheRef.current.get(cacheKey));
            setLoading(false);
            return;
        }

        setLoading(true);

        const timer = setTimeout(async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                const response = await productsService.getSuggestions(trimmedQuery, {
                    signal: controller.signal
                });

                // response từ axiosClient đã unwrap response.data -> { success, data }
                const resultData = response?.data || response;
                const formatted = {
                    categories: resultData?.categories || [],
                    brands: resultData?.brands || [],
                    products: resultData?.products || [],
                    keywords: resultData?.keywords || []
                };

                cacheRef.current.set(cacheKey, formatted);
                setSuggestions(formatted);
            } catch (err) {
                if (err?.name !== "CanceledError" && err?.name !== "AbortError" && err?.code !== "ERR_CANCELED") {
                    console.warn("Search suggestion error:", err);
                }
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [query, delay]);

    return {
        query,
        setQuery,
        suggestions,
        loading,
        isOpen,
        setIsOpen,
        recentSearches,
        saveRecentSearch,
        removeRecentSearch,
        clearRecentSearches
    };
}
