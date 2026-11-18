//cache lifetime 
const CACHE_TTL = 5 * 6 * 1000;

//in memory cache
const cache = new Map();

//return cached review data if it exists and has not expired
export function getReviewCache(key) {
    const item = cache.get(key);

    if (!item) return null;

    // Remove expired cache entries
    if (Date.now() - item.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }

    return item.data;
}

//Stores review response in cache.
 
export function setReviewCache(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

//Clears all cached pages/sorts for a product.
//Useful after submitting a new review or manual refresh.

export function clearReviewCache(productId) {
    for (const key of cache.keys()) {
        if (key.startsWith(`${productId}-`)) {
            cache.delete(key);
        }
    }
}