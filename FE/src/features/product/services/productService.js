const API_URL = import.meta.env.VITE_API_BASE_URL;
const PRODUCTS_URL = `${API_URL}/products`;
const FILTER_URL = `${PRODUCTS_URL}/filter`;

export const productsService = {
    async searchProducts({ search = "", category = "All" }) {
        const response = await fetch(FILTER_URL);

        if (!response.ok) {
            throw new Error("failed to fetch products");
        }

        const data = await response.json();
        return data;
    },

    async getProducts() {
        const response = await fetch(FILTER_URL);

        if (!response.ok) {
            throw new Error("failed to fetch products")
        }

        const data = await response.json()
        return data;
    },

    async filterProducts(params) {

        const query = new URLSearchParams();

        if (params.search) query.append("search", params.search);

        params.categoryIds?.forEach(id =>
            query.append("categoryIds", id)
        );

        params.attributeValueIds?.forEach(id =>
            query.append("attributeValueIds", id)
        );

        if (params.minPrice) query.append("minPrice", params.minPrice);
        if (params.maxPrice) query.append("maxPrice", params.maxPrice);

        const queryString = query.toString();
        const res = await fetch(`${FILTER_URL}${queryString ? `?${queryString}` : ""}`);

        if (!res.ok) throw new Error("failed to fetch products");

        const data = await res.json();
        return data;
    },

    async getProductById(id) {
        const response = await fetch(`${PRODUCTS_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Product not found")
        }

        const data = await response.json()
        return data;
    }
}