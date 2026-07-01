import { useEffect, useState, useCallback } from "react";
import { retailerProductApi } from "../api/retailerProductApi";
import { notify } from "@/shared/utils/Notify";

/**
 * Hook quản lý state danh sách sản phẩm của retailer.
 * Hỗ trợ: search, filter, sort, pagination, refetch.
 * Khi gặp lỗi API (ví dụ 401 chưa đăng nhập), hiển thị thông báo thay vì crash.
 */
export default function useRetailerProducts(params = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await retailerProductApi.getMyProducts(params);
            const data = res?.data;

            setProducts(data?.items || []);
            setPagination({
                page: data?.page || params.page || 1,
                pageSize: data?.pageSize || params.pageSize || 20,
                total: data?.total || 0,
                totalPages: data?.totalPages || 0,
            });
        } catch (err) {
            // err có thể là object từ ErrorHandle hoặc Error object
            const message = err?.message
                || err?.data?.message
                || (typeof err === "string" ? err : "An error occurred while loading products");
            setError(message);
            notify.error(message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, pagination, refetch: fetchProducts };
}
