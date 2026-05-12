import { createContext, useEffect, useState } from "react";
import { getProfileApi } from "../api/authService";
import { ROLES } from "../../../constants/roles";

// Khởi tạo Context để chia sẻ dữ liệu xác thực
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null); // Trạng thái lưu thông tin người dùng
    const [loading, setLoading] = useState(true); // Trạng thái chờ quá trình kiểm tra đăng nhập hoàn tất

    // Hàm gọi API lấy thông tin người dùng
    const fetchUser = async () => {
        try {
            const res = await getProfileApi();
            setUser(res.data); // Nếu thành công, lưu thông tin user vào state
        } catch {
            setUser(null); // Nếu lỗi (chưa đăng nhập, token hết hạn), set user về null
        } finally {
            setLoading(false); // Dù thành công hay thất bại cũng kết thúc trạng thái loading
        }
    };

    // Chạy một lần duy nhất khi ứng dụng/Provider được render lần đầu (khi user f5 trang)
    useEffect(() => {
        fetchUser();
    }, []);

    // Cung cấp state user, hàm thay đổi state (setUser), và trạng thái loading cho các component con
    return(
        <AuthContext.Provider value={{ user, setUser, loading, fetchUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}