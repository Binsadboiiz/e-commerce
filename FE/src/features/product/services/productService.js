const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/products`;

export const productsService = {
    async searchProducts({ search = "", category = "All" }) {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error("failed to fetch products");
        }

        const data = await response.json();
        return data;
    },

    async getProducts() {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error("failed to fetch products")
        }

        const data = await response.json()

        return data;
    },

    async getProductById(id) {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Product not found")
        }

        return response.json();
    }
}