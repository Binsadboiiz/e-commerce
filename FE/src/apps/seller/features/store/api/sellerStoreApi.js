import axiosClient from "@/shared/features/auth/api/axiosClient";

const SELLER_STORE_URL = "/seller/store";

/**
 * API service for seller store profile and onboarding operations.
 */
export const sellerStoreApi = {
    /**
     * Retrieves current seller's shop initialization status and pre-filled onboarding data.
     */
    async getShopStatus() {
        return axiosClient.get(`${SELLER_STORE_URL}/status`);
    },

    /**
     * Initializes seller store profile during first-time onboarding setup.
     */
    async setupShop(data) {
        return axiosClient.post(`${SELLER_STORE_URL}/setup`, data);
    },

    /**
     * Retrieves detailed store profile for the authenticated seller.
     */
    async getStoreProfile() {
        return axiosClient.get(`${SELLER_STORE_URL}/profile`);
    },

    /**
     * Updates store profile details for the authenticated seller.
     */
    async updateStoreProfile(data) {
        return axiosClient.put(`${SELLER_STORE_URL}/profile`, data);
    }
};

export default sellerStoreApi;
