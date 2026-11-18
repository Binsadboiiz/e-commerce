export function parseQuery(searchParams) {
    return {
        search: searchParams.get("q") || "",
        categoryIds: searchParams.getAll("categoryIds"),
        attributeValueIds: searchParams.getAll("attributeValueIds"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
        sortBy: searchParams.get("sortBy")
    };
}