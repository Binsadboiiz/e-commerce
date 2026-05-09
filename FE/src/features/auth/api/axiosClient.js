import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:5269/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

// intercept request
axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// intercept response

axiosClient.interceptors.response.use(
    (response) => response.data,

    async (error) => {
        if(error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosClient;