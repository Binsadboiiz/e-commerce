import axiosClient from "../../../services/axiosClient";

const orderApi = {
    getOrders(userId) {
        return axiosClient.get(`/order-tracking/${userId}/my-orders`);
    },
    getOrderTracking(orderId, userId) {
        return axiosClient.get(`/order-tracking/Order:${orderId}/${userId}`);
    },
};

export default orderApi;