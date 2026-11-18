import axiosClient from "@/shared/features/auth/api/axiosClient.js";

const SELLER_VOUCHERS_URL = "/seller/vouchers";

export const sellerVoucherApi = {
    async getMyVouchers(params = {}) {
        const { page = 1, pageSize = 20, search } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        queryParams.append("pageSize", pageSize);

        if (search) queryParams.append("search", search);

        return axiosClient.get(`${SELLER_VOUCHERS_URL}?${queryParams.toString()}`);
    },

    async createVoucher(data) {
        return axiosClient.post(SELLER_VOUCHERS_URL, data);
    },

    async updateVoucher(id, data) {
        return axiosClient.put(`${SELLER_VOUCHERS_URL}/update/${id}`, data);
    },

    async deleteVoucher(id) {
        return axiosClient.delete(`${SELLER_VOUCHERS_URL}/remove/${id}`);
    }
};
