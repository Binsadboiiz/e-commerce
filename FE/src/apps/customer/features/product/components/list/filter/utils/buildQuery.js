export function buildQuery(params) {
    const query = new URLSearchParams();

    if (params.search) query.set("q", params.search);

    params.categoryIds?.forEach(id =>
        query.append("categoryIds", id)
    );

    params.attributeValueIds?.forEach(id =>
        query.append("attributeValueIds", id)
    );

    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);

    if (params.sortBy) query.set("sortBy", params.sortBy);

    return query;
}