import { useCallback, useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import { useOrderUserId } from "../utils/orderUser";

export default function useMyOrders() {
    const userId = useOrderUserId();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        if (!userId) {
            setOrders([]);
            setLoading(false);
            setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await orderApi.getOrders(userId);
            setOrders(Array.isArray(response) ? response : []);
        } catch (err) {
            setOrders([]);
            setError(err.message || "Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, refreshOrders: fetchOrders };
}
