import { useAuth } from "./useAuth";

// FLAG TẠM THỜI TẮT CHECK ROLE ĐỂ TEST GIAO DIỆN (Đổi thành false khi muốn bật lại)
const DISABLE_ROLE_CHECK = true;

export const useRole = () => {
    const { user } = useAuth(); // Lấy thông tin user hiện tại từ context

    // Hàm kiểm tra xem user có một trong những quyền được yêu cầu hay không
    const hasRole = (roles = []) => {
        if (DISABLE_ROLE_CHECK) return true;
        if (!user) return false; // Nếu chưa đăng nhập thì không có quyền
        
        // Kiểm tra xem role của user hiện tại có nằm trong mảng roles truyền vào không (không phân biệt hoa thường)
        const userRoleLower = user.role?.toLowerCase();
        return roles.some(role => role?.toLowerCase() === userRoleLower); 
    };

    // Trả về hàm hasRole để các component khác (như ProtectedRoute) sử dụng
    return { role: user?.role, hasRole };
};