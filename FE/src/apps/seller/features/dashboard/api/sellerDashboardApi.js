import axiosClient from "@/shared/features/auth/api/axiosClient";

/**
 * URL path for the seller dashboard statistics endpoint.
 */
const SELLER_DASHBOARD_URL = "/seller/dashboard";

/**
 * URL path for updating order/shipment status.
 */
const ORDER_TRACKING_URL = "/order-tracking";

/**
 * API client service for Seller Dashboard data operations.
 */
export const sellerDashboardApi = {
    /**
     * Fetches dashboard performance KPIs, trend data, category composition, and recent orders.
     * @param {string} timeRange - The period range to aggregate data for ("today", "7d", "30d", "ytd").
     * @returns {Promise<any>} Response data containing the dashboard payload.
     */
    async getDashboardData(timeRange = "7d") {
        return axiosClient.get(`${SELLER_DASHBOARD_URL}?timeRange=${timeRange}`);
    },

    /**
     * Updates an order tracking status (e.g. ship or cancel) by communicating with the backend OrderTracking service.
     * @param {number|string} orderId - The raw numeric ID of the order (without 'ORD-' prefix).
     * @param {string} status - The target status ('shipping', 'completed', 'cancelled').
     * @param {string} [location="Shop Warehouse"] - Current geographic or logistic location.
     * @param {string} [description="Status updated by shop merchant."] - Log details for the timeline history.
     * @returns {Promise<any>} Response indicating success or failure.
     */
    async updateOrderStatus(orderId, status, location = "Shop Warehouse", description = "Status updated by shop merchant.") {
        const payload = {
            status,
            location,
            description,
            updatedBy: "seller"
        };
        return axiosClient.put(`${ORDER_TRACKING_URL}/Order:${orderId}/status`, payload);
    }
};
