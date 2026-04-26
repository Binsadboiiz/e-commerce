import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:5269/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

// intercept request
axiosClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// intercept response

axiosClient.interceptors.response.use(
    res => res.data,
    error => {
        return Promise.reject(error);
    }
)

export default axiosClient;