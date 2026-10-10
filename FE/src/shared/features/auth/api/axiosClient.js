import axios from "axios";
import { notify } from "../../../utils/Notify";
import { ROUTES } from "@/config/route.config";
import { apiCache } from "./apiCache";

/**
 * Global Axios client configuration.
 * Configured with base API URL, timeout limits, and credentials support for HttpOnly cookies.
 */
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:5269/api",
    withCredentials: true, // Crucial for sending and receiving HttpOnly cookies across cross-origin requests
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000
});

// Request Interceptor: Checks internet connectivity and in-memory cache before hitting the network
axiosClient.interceptors.request.use(
    (config) => {
        if (!navigator.onLine) {
            notify.error("No Internet Connection");
            return Promise.reject(new Error("No Internet Connection"));
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        const isGet = (config.method || 'get').toLowerCase() === 'get';
        const useCache = isGet && config.cache !== false;

        if (useCache) {
            const cacheKey = apiCache.generateKey(config.url, config.params);
            config._cacheKey = cacheKey;

            if (!config.forceRefresh) {
                const cached = apiCache.get(cacheKey);
                if (cached !== null) {
                    config.adapter = () => Promise.resolve({
                        data: cached,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                        request: {}
                    });
                }
            }
        }

        return config;
    },
    (error) => {
        notify.error("Request failed!");
        return Promise.reject(error);
    }
);

// Response Interceptor: Handles caching, cache invalidation, and global errors
let isShowingServerError = false;
let isRedirectingAuth = false;

axiosClient.interceptors.response.use(
    (response) => {
        const config = response.config || {};
        const isGet = (config.method || 'get').toLowerCase() === 'get';

        if (isGet && config.cache !== false && config._cacheKey) {
            apiCache.set(config._cacheKey, response.data, config.cacheTTL || 30000);
        } else if (!isGet) {
            // Mutation occurred: automatically invalidate relevant caches
            const url = config.url || '';
            if (url.includes('/cart')) {
                apiCache.invalidate('/cart');
            } else if (url.includes('/checkout') || url.includes('/order')) {
                apiCache.invalidate('/order');
                apiCache.invalidate('/cart');
            } else if (url.includes('/seller')) {
                apiCache.invalidate('/seller');
            } else if (url.includes('/products')) {
                apiCache.invalidate('/products');
            } else {
                apiCache.invalidate(url);
            }
        }

        return response.data;
    },

    async (error) => {
        if(error.code === "ECONNABORTED") {
            notify.error("Server takes too long to respond!")
            return Promise.reject(error);
        }

        if(!error.response) {
            if(!isShowingServerError) {
                isShowingServerError = true;
                notify.error("Can't connect to Server");
                setTimeout(() => {
                    isShowingServerError = false;
                }, 5000);
            }
            return Promise.reject(error);
        }
        const publicRoutes = [ ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER];
        
        const status = error.response.status;

        // Custom config flags
        const skipAuthError = error.config?.skipAuthError;
        const skipErrorToast = error.config?.skipErrorToast;

        if(status === 401) {
            if(skipAuthError) {
                return Promise.reject(error);
            }
            if(!isRedirectingAuth && !publicRoutes.includes(window.location.pathname)) {
                isRedirectingAuth = true;
                notify.warning("The login session has expired");
                setTimeout(() => {
                    window.location.href = ROUTES.LOGIN;
                    isRedirectingAuth = false;
                }, 3000);
            }
            return Promise.reject(error);
        }

        if(status === 403) {
            if(!skipErrorToast) {
                notify.error("You do not have access!");
            }
            return Promise.reject(error);
        }

        if (status >= 500) {

            if (!skipErrorToast) {
                notify.error("The server is experiencing issues.");
            }

            return Promise.reject(error);
        }
        else {
            const message = error.response.data?.message || "An Error occured";

            notify.error(message);
        }

        return Promise.reject(error);
    }
);

export { apiCache };
export default axiosClient;
