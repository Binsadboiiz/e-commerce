/**
 * High-performance In-Memory API Cache & In-Flight Request Deduplication
 * Reduces API wait times, eliminates duplicate HTTP requests, and enables instant page navigations.
 */

class ApiCache {
    constructor() {
        this.cache = new Map();
        this.inFlight = new Map();
        this.defaultTTL = 30 * 1000; // 30 seconds default
    }

    /**
     * Generate unique normalized cache key from URL and params
     */
    generateKey(url, params = {}) {
        const sortedParams = Object.keys(params || {})
            .sort()
            .map(k => `${k}=${JSON.stringify(params[k])}`)
            .join('&');
        return `${url}?${sortedParams}`;
    }

    /**
     * Get cached response if still fresh
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Store response in cache with optional TTL
     */
    set(key, data, ttl = this.defaultTTL) {
        // Don't cache error states or empty/falsy payloads
        if (data === undefined || data === null) return;

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * Invalidate all cache entries matching prefix/tag
     */
    invalidate(pattern) {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Retrieve or register an in-flight promise to prevent concurrent duplicate calls
     */
    getInFlight(key) {
        return this.inFlight.get(key);
    }

    setInFlight(key, promise) {
        this.inFlight.set(key, promise);
    }

    clearInFlight(key) {
        this.inFlight.delete(key);
    }
}

export const apiCache = new ApiCache();
