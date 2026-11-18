import axiosClient from "@/shared/features/auth/api/axiosClient";

const orderApi = {
    getOrders() {
        return axiosClient.get(`/order-tracking/my-orders`);
    },
    getOrderTracking(orderId) {
        return axiosClient.get(`/order-tracking/Order:${orderId}`);
    },
};

export default orderApi;
