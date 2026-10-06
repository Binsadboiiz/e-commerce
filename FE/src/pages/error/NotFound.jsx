import { Link } from 'react-router-dom';
import SEOHead from '@/shared/components/SEOHead';
import Button from '@/shared/components/ui/Button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <SEOHead 
                title="404 - Trang Không Tồn Tại" 
                robots="noindex, nofollow" 
                description="Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
            />
            <div className="w-24 h-24 rounded-full bg-red-50 text-primary flex items-center justify-center mb-6 text-4xl font-extrabold shadow-sm">
                404
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trang Không Tồn Tại</h1>
            <p className="text-gray-600 text-sm max-w-md mb-8">
                Đường dẫn bạn truy cập có thể đã thay đổi hoặc không còn khả dụng. Vui lòng quay về trang chủ để tiếp tục mua sắm.
            </p>
            <Link to="/">
                <Button variant="primary" size="lg">
                    Quay Về Trang Chủ
                </Button>
            </Link>
        </div>
    );
}