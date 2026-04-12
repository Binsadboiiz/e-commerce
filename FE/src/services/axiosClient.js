import axios from "axios";
import { getErrorHandle } from "../utils/ErrorHandle";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

axiosClient.interceptors.response.use(
    res => res,
    error => {
        return Promise.reject(getErrorHandle(error));
    }
)

export default axiosClient;