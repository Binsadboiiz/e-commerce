const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/categories`;

export const categoryService = {
    async getCategories() {
        const res = await fetch(BASE_URL);

        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        return data;
    }
}