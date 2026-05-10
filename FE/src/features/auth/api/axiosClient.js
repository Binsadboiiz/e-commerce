import axios from "axios";
import { notify } from "../../../utils/Notify";

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

        if(error.response?.status === 401) {
            notify.warning("The login session has expired.");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        }

        else if(error.response?.status === 403)
            notify.error("You do not have access.");

        else if(error.response?.status >= 500)
            notify.error("The server is experiencing issues.");
        else {
            const message = error.response.data?.message || "An Error occured";

            notify.error(message);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;