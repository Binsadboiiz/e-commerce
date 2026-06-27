import { queryBuilder } from "../utils/queryBuilder.js";
import axiosClient from "../../auth/api/axiosClient.js";

const PRODUCT_URL = "/products";

export const productsService = {
    /*
    * Filters products based on the provided filter object and returns the filtered products.
    */
    getProducts(params = {}) {
        return axiosClient.get(`${PRODUCT_URL}/filter`, {
            params,
            paramsSerializer: (params) => queryBuilder.toQueryString(params),
        });
    },

    /*
    * Gets a product by its ID
    */ 
    getProductById(id) {
        return axiosClient.get(`${PRODUCT_URL}/by-id/${id}`);
    },

    getFilterMeta(params = {}) {
        return axiosClient.get(`${PRODUCT_URL}/filter/meta`, {
            params,
            paramsSerializer: (params) => queryBuilder.toQueryString(params),
        });
    },

    /*
    * Gets product detail by its slug
    */
    async getProductDetail(slug) {
        const res = await axiosClient.get(`${PRODUCT_URL}/${slug}`);
        return res.data;
    }
};