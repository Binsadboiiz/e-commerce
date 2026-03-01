//Service chỉ chịu trách nhiệm gọi API

const BASE_URL = "api/products";

/**
 * Search products theo keyword và filter
 * @param {Object} params
 * @param {string} params.search - keyword search
 * @param {string} params.category - category filter
 */

export async function searchProducts({ search = "", category = "All" }) {
    const query = new URLSearchParams({
        q: search,
        category
    }).toString();

    const response = await fetch(`${BASE_URL}?${query}`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

/**
 * Lấy chi tiết 1 product
 * outOfStock sẽ bị ẩn khi hiện kq
 */

export async function getProductById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    
    if (!response.ok) {
        throw new Error("Product not found")
    }

    return response.json();
}