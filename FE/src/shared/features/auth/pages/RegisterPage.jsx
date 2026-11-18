import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import SEOHead from "@/shared/components/SEOHead";

export default function RegisterPage() {
    return (
        <AuthLayout>
            <SEOHead 
                title="Đăng Ký Tài Khoản" 
                description="Tạo tài khoản E-Commerce Enterprise ngay hôm nay để mua sắm tiện lợi và trải nghiệm vô vàn khuyến mãi."
            />
            <RegisterForm />
        </AuthLayout>
    );
}
