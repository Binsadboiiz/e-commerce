import axiosClient from "@/shared/features/auth/api/axiosClient";

/**
 * API service cho retailer products.
 * Gọi endpoint GET /api/seller/products.
 */
const SELLER_PRODUCTS_URL = "/seller/products";

export const sellerProductApi = {
    /**
     * Lấy danh sách sản phẩm của seller hiện tại.
     * Hỗ trợ: search, filter status, sort, pagination.
     */
    async getMyProducts(params = {}) {
        const { page = 1, pageSize = 20, search, status, sortBy } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        queryParams.append("pageSize", pageSize);

        if (search) queryParams.append("search", search);
        if (status && status !== "all") queryParams.append("status", status);
        if (sortBy) queryParams.append("sortBy", sortBy);

        return axiosClient.get(`${SELLER_PRODUCTS_URL}?${queryParams.toString()}`);
    },

    async createProduct(data) {
        return axiosClient.post(SELLER_PRODUCTS_URL, data);
    },

    async updateProduct(id, data) {
        return axiosClient.put(`${SELLER_PRODUCTS_URL}/update/${id}`, data);
    },

    async deleteProduct(id) {
        return axiosClient.delete(`${SELLER_PRODUCTS_URL}/remove/${id}`);
    }
};
