import axiosClient from "../../../services/axiosClient";

const checkoutApi = {
    getAddresses() {
        return axiosClient.get("/checkout/addresses");
    },
    getPaymentMethods() {
        return axiosClient.get("/checkout/payment-methods");
    },
    previewCart(payload) {
        return axiosClient.post("/checkout/preview", payload);
    },
    placeCartOrder(payload) {
        return axiosClient.post("/checkout/place-order", payload);
    },
    previewBuyNow(payload) {
        return axiosClient.post("/checkout/buy-now/preview", payload);
    },
    placeBuyNowOrder(payload) {
        return axiosClient.post("/checkout/buy-now/place-order", payload);
    }
};

export default checkoutApi;
