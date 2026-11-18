import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/features/auth/hooks/useAuth";
import { useRole } from "@/shared/features/auth/hooks/useRole";
import PageSkeleton from "@/shared/components/ui/PageSkeleton";
import { ROUTES } from "@/config/route.config";

// FLAG TẠM THỜI TẮT BẢO VỆ ROUTE ĐỂ TEST GIAO DIỆN (Đổi thành false khi muốn bật lại)
const DISABLE_PROTECTION = false;

// Nhận vào children (nội dung trang cần bảo vệ) và allowedRoles (mảng các quyền được phép truy cập)
const ProtectedRoute = ({ children, allowedRoles }) => {
    // Bỏ qua kiểm tra nếu cờ DISABLE_PROTECTION đang bật
    if (DISABLE_PROTECTION) {
        return children;
    }

    const { user, loading } = useAuth(); // Kiểm tra xem ứng dụng đã lấy xong dữ liệu user chưa
    const { hasRole } = useRole(); // Lấy hàm kiểm tra quyền

    // Nếu đang lấy dữ liệu (chờ API trả về), hiển thị Skeleton trang
    if (loading) return <PageSkeleton />;

    // Nếu chưa đăng nhập, điều hướng tới trang Login
    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Sau khi tải xong, nếu user không có vai trò phù hợp, điều hướng thẳng về trang /unauthorized
    if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Nếu qua được các bước trên, render nội dung trang bình thường
    return children;
};

export default ProtectedRoute;