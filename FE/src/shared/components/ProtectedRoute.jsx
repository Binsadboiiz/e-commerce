import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/features/auth/hooks/useAuth"
import { useRole } from "@/shared/features/auth/hooks/useRole";

// Nhận vào children (nội dung trang cần bảo vệ) và allowedRoles (mảng các quyền được phép truy cập)
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { loading } = useAuth(); // Kiểm tra xem ứng dụng đã lấy xong dữ liệu user chưa
    const { hasRole } = useRole(); // Lấy hàm kiểm tra quyền

    // Nếu đang lấy dữ liệu (chờ API trả về), hiển thị chữ Loading (tránh việc đá user ra ngoài nhầm)
    if (loading) return <div>Loading...</div>

    // Sau khi tải xong, nếu user không có vai trò phù hợp, điều hướng thẳng về trang /unauthorized
    // Dùng replace để ghi đè lịch sử duyệt web, không cho phép ấn nút "Back" quay lại trang cấm
    if (!hasRole(allowedRoles))
        return <Navigate to="/unauthorized" replace />;

    // Nếu qua được các bước trên, render nội dung trang bình thường
    return children;
};

export default ProtectedRoute;