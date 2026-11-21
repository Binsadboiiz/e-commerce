import { Link } from 'react-router-dom';
import SEOHead from '@/shared/components/SEOHead';
import Button from '@/shared/components/ui/Button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <SEOHead
                title="404 - Trang Không Tồn Tại"
                statusCode={404}
                isReady={true}
                robots="noindex, nofollow"
                description="Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
            />
            <p
                aria-hidden="true"
                className="flex items-baseline gap-2 text-[var(--color-secondary)] leading-none mb-4"
                style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, letterSpacing: '-0.05em', fontSize: 'clamp(5rem, 22vw, 9rem)' }}
            >
                404<span className="dot" style={{ width: '0.14em', height: '0.14em' }} />
            </p>
            <h1 className="text-2xl sm:text-3xl text-slate-900 mb-2" style={{ fontWeight: 700 }}>Không tìm thấy trang</h1>
            <p className="text-slate-600 text-sm max-w-md mb-8">
                Đường dẫn có thể đã thay đổi hoặc không còn khả dụng. Hãy quay về trang chủ hoặc xem danh sách sản phẩm.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Link to="/"><Button size="lg">Về trang chủ</Button></Link>
                <Link to="/products"><Button size="lg" variant="outline">Xem sản phẩm</Button></Link>
            </div>
        </div>
    );
}
