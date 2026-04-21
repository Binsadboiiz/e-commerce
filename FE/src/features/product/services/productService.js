import { queryBuilder } from "@/features/product/utils/queryBuilder";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const PRODUCTS_URL = `${API_URL}/products`;
const FILTER_URL = `${PRODUCTS_URL}/filter`;

export const productsService = {
    async searchProducts(params = {}) {
        const qs = queryBuilder.toQueryString(params);

        const res = await fetch(`${FILTER_URL}?${qs}`);

        if (!res.ok) throw new Error("failed to fetch products");

        const data = await res.json();
        return data;
    },

    async getProducts(params = {}) {
        const qs = queryBuilder.toQueryString(params);

        const res = await fetch(`${FILTER_URL}?${qs}`);

        if (!res.ok) throw new Error("failed to fetch products");

        const data = await res.json();
        return data;
    },

    async filterProducts(params = {}) {
        const qs = queryBuilder.toQueryString(params);

        const res = await fetch(`${FILTER_URL}?${qs}`);

        if (!res.ok) throw new Error("failed to fetch products");

        const data = await res.json();
        return data;
    },

    async getProductById(id) {
        const res = await fetch(`${PRODUCTS_URL}/${id}`);

        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        return data;
    }
}