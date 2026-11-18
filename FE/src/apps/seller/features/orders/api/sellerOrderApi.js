import axiosClient from "@/shared/features/auth/api/axiosClient";

/**
 * API service cho Seller Order Management.
 * Endpoints: /api/seller/orders
 */
const SELLER_ORDERS_URL = "/seller/orders";

export const sellerOrderApi = {
    /**
     * Lấy danh sách đơn hàng của seller hiện tại.
     * @param {Object} params - { status, page, pageSize }
     */
    async getOrders(params = {}) {
        const { status, page = 1, pageSize = 20 } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        queryParams.append("pageSize", pageSize);

        if (status && status !== "all") {
            queryParams.append("status", status);
        }

        return axiosClient.get(`${SELLER_ORDERS_URL}?${queryParams.toString()}`);
    },

    /**
     * Lấy chi tiết đơn hàng theo orderId
     * @param {number|string} orderId 
     */
    async getOrderDetail(orderId) {
        return axiosClient.get(`${SELLER_ORDERS_URL}/${orderId}`);
    },

    /**
     * Cập nhật trạng thái cho đơn hàng thuộc shop
     * @param {number|string} orderId 
     * @param {Object} payload - { status, location, description }
     */
    async updateOrderStatus(orderId, payload) {
        return axiosClient.put(`${SELLER_ORDERS_URL}/${orderId}/status`, payload);
    }
};
