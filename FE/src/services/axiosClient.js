import axios from "axios";
import { getErrorHandle } from "../utils/ErrorHandle";

const axiosClient = axios.create({
    baseURL: "https://localhost:5000/api",
    withCredentials: true
})

axiosClient.interceptors.response.use(
    res => res,
    error => {
        return Promise.reject(getErrorHandle(error));
    }
)

export default axiosClient;