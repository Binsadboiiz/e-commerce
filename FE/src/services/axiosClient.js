import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:5000/api",
    withCredentials: true
})

export default axiosClient;