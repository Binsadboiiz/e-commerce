const BASE_URL = "https://dummyjson.com";

export async function searchProducts(query, { signal } = {}) {
    const url = new URL("/products/search", BASE_URL);
    url.searchParams.set("q", query);

    const response = await fetch(url.toString(), {
        method: "GET",
        signal,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `Failed to search products (${response.status}). ${text || ""}`.trim()
        );
    }

    const data = await response.json();
    return data;
}

