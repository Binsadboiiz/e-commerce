export const queryBuilder = {
    toQueryString(params) {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value == null || value === "") return;

            if (Array.isArray(value)) {
                value.forEach(v => query.append(key, v));
            } else {
                query.append(key, value);
            }
        });

        return query.toString();
    }
};