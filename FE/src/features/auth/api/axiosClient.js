import axios from "axios";
import { notify } from "../../../utils/Notify";
import { ROUTES } from "../../../config/route.config";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:5269/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000
});

// intercept request
axiosClient.interceptors.request.use(
    (config) => {
        if(!navigator.onLine) {
            notify.error("No Internet Connection");

            return Promise.reject(
                new Error("No Internet Connection")
            );
        }
        return config;
    },
    (error) => {
        notify.error("Request failed!");
        return Promise.reject(error);
    }
);

// intercept response
let isShowingServerError = false;
let isRedirectingAuth = false;

axiosClient.interceptors.response.use(
    (response) => response.data,

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

export default axiosClient;