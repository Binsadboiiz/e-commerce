//Service chỉ chịu trách nhiệm gọi API

const BASE_URL = "https://dummyjson.com/products";

/**
 * Search products theo keyword và filter
 * @param {Object} params
 * @param {string} params.search - keyword search
 * @param {string} params.category - category filter
 */

export async function searchProducts({ search = "", category = "All" }) {
    let url = "https://dummyjson.com/products";

    if (search) {
        url = `https://dummyjson.com/products/search?q=${search}`;
    } else if (category !== "All") {
        url = `https://dummyjson.com/products/category/${category}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("failed to fetch products")
    }

    const data = await response.json()

    return data.products;
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