import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import SEOHead from "@/shared/components/SEOHead";

export default function LoginPage() {
    return (
        <AuthLayout>
            <SEOHead 
                title="Đăng Nhập Tài Khoản" 
                description="Đăng nhập tài khoản E-Commerce Enterprise để quản lý đơn hàng, giỏ hàng và nhận ưu đãi độc quyền."
            />
            <LoginForm />
        </AuthLayout>
    );
}
