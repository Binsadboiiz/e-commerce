import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll lên đầu trang mỗi khi pathname thay đổi
 * Đặt component này bên trong <BrowserRouter> (ngoài <Routes>)
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}
