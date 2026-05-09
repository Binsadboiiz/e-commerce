import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";
import axiosClient from "../features/auth/api/axiosClient";
import { getErrorHandle } from "../utils/ErrorHandle";
import { ROUTES } from "../config/route.config";

export default function GlobalErrorHandler({ children }) {
    const { setGlobalError } = useContext(ErrorContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Cài đặt interceptor để bắt lỗi từ toàn bộ request của axiosClient
        const interceptorId = axiosClient.interceptors.response.use(
            (response) => response,
            (error) => {
                // Lấy chi tiết lỗi từ ErrorHandle.js
                const formattedError = getErrorHandle(error);
                
                // Lưu vào context
                setGlobalError(formattedError);
                
                // Tạm thời TẮT redirect 
                // navigate(ROUTES.ERROR || "/error");
                
                // Vẫn reject để hook (nếu cần) có thể catch
                return Promise.reject(formattedError);
            }
        );

        // Cleanup interceptor khi unmount
        return () => {
            axiosClient.interceptors.response.eject(interceptorId);
        };
    }, [navigate, setGlobalError]);

    return children;
}
