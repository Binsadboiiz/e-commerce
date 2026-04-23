import { queryBuilder } from "@/features/product/utils/queryBuilder";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PRODUCTS_URL = `${API_URL}/products`;
const FILTER_URL = `${PRODUCTS_URL}/filter`;
const FILTER_META_URL = `${PRODUCTS_URL}/filter/meta`;

export const productsService = {
    /**
     * MAIN: filter + pagination + sort + search
     */
    async getProducts(params = {}) {
        const qs = queryBuilder.toQueryString(params);

        const res = await fetch(`${FILTER_URL}?${qs}`);

        if (!res.ok) throw new Error("Failed to fetch products");

        return res.json();
    },

    /**
     * SINGLE PRODUCT
     */
    async getProductById(id) {
        const res = await fetch(`${PRODUCTS_URL}/${id}`);

        if (!res.ok) throw new Error("Product not found");

        return res.json();
    },

    /**
     * FILTER META (categories, brands, attributes)
     */
    async getFilterMeta(params = {}) {
        const qs = queryBuilder.toQueryString(params);

        const url = qs
            ? `${FILTER_META_URL}?${qs}`
            : FILTER_META_URL;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch filter meta");

        return res.json();
    },
};