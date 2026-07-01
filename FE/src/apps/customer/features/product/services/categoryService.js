import { notify } from "../../../utils/Notify.js";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "https://localhost:5269/api"}/categories`;

export const categoryService = {
    async getCategories() {
        const res = await fetch(BASE_URL);

        if (!res.ok) {
            notify.error("Failed to fetch categories");
            throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        return data;
    }
}