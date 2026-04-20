import { useCallback, useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import { useOrderUserId } from "../utils/orderUser";

export default function useOrderTracking(orderId) {
    const userId = useOrderUserId();
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTracking = useCallback(async () => {
        if (!userId) {
            setTracking(null);
            setLoading(false);
            setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        if (!orderId) {
            setTracking(null);
            setLoading(false);
            setError("OrderId không hợp lệ.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await orderApi.getOrderTracking(orderId, userId);
            setTracking(response ?? null);
        } catch (err) {
            setTracking(null);
            setError(err.message || "Không thể tải chi tiết theo dõi đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [orderId, userId]);

    useEffect(() => {
        fetchTracking();
    }, [fetchTracking]);

    return { tracking, loading, error, refreshTracking: fetchTracking };
}
