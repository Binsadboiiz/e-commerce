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
    },

    /**
     * Upload single image to Cloudinary CDN
     */
    async uploadImage(file) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post("/images/upload", formData, {
            timeout: 60000,
        });
    },

    /**
     * Upload multiple images to Cloudinary CDN
     */
    async uploadImages(files) {
        const formData = new FormData();
        const fileList = Array.isArray(files) ? files : Array.from(files);
        fileList.forEach((file) => {
            formData.append("files", file);
        });
        return axiosClient.post("/images/upload-multiple", formData, {
            timeout: 60000,
        });
    },

    async getCategories() {
        return axiosClient.get("/categories");
    },

    async getBrands() {
        return axiosClient.get("/brands");
    }
};
