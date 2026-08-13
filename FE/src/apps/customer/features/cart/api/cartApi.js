import axiosClient from "@/shared/features/auth/api/axiosClient"

const cartApi = {
    getCart() {
        return axiosClient.get("/cart", {
            skipAuthError: true,
            skipErrorToast: true
        });
    },
    add(productId, quantity, variantId = null) {
        return axiosClient.post("/cart/add", { productId, quantity, variantId });
    },
    update(productId, quantity, variantId = null) {
        return axiosClient.put("/cart/update", { productId, quantity, variantId });
    },
    remove(productId, variantId = null) {
        const params = variantId ? `?variantId=${variantId}` : '';
        return axiosClient.delete(`/cart/remove/${productId}${params}`);
    },
    clear() {
        return axiosClient.delete("/cart/clear");
    }
};

export default cartApi;