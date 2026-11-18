import axiosClient from "@/shared/features/auth/api/axiosClient";

const ADDRESS_URL = "/user/addresses";

export const customerAddressApi = {
    /**
     * Get all saved addresses of current user
     */
    async getAddresses() {
        return axiosClient.get(ADDRESS_URL);
    },

    /**
     * Add new address (Max 5 addresses)
     */
    async createAddress(data) {
        return axiosClient.post(ADDRESS_URL, data);
    },

    /**
     * Update existing address
     */
    async updateAddress(id, data) {
        return axiosClient.put(`${ADDRESS_URL}/${id}`, data);
    },

    /**
     * Delete an address
     */
    async deleteAddress(id) {
        return axiosClient.delete(`${ADDRESS_URL}/${id}`);
    },

    /**
     * Set an address as default
     */
    async setDefaultAddress(id) {
        return axiosClient.put(`${ADDRESS_URL}/${id}/default`);
    }
};

export default customerAddressApi;
