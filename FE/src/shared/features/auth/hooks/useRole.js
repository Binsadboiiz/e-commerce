import { useAuth } from "./useAuth";

export const useRole = () => {
    const { user } = useAuth(); // Lấy thông tin user hiện tại từ context

    // Hàm kiểm tra xem user có một trong những quyền được yêu cầu hay không
    const hasRole = (roles = []) => {
        if (!user) return false; // Nếu chưa đăng nhập thì không có quyền
        
        // Kiểm tra xem role của user hiện tại có nằm trong mảng roles truyền vào không
        return roles.includes(user.role); 
    };

    // Trả về hàm hasRole để các component khác (như ProtectedRoute) sử dụng
    return { role: user?.role, hasRole };
};