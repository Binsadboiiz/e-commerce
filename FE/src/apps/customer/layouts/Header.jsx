import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    FiShoppingCart, 
    FiUser, 
    FiLogOut, 
    FiPhoneCall, 
    FiGlobe, 
    FiChevronDown, 
    FiShoppingBag 
} from 'react-icons/fi';
import styles from './Header.module.css';
import SearchBar from "@/apps/customer/features/product/components/list/search/SearchBar";
import { useCart } from "@/apps/customer/features/cart/hooks/useCart";
import { AuthContext } from "@/shared/features/auth/context/AuthContext";
import { logoutApi } from "@/shared/features/auth/api/authService";
import { ROUTES } from "@/config/route.config";
import { notify } from "@/shared/utils/Notify";
import CartContext from "@/apps/customer/features/cart/context/CartContext";
import SellerHeaderAction from "@/apps/customer/features/seller/components/common/SellerHeaderAction";
import { useLanguage } from "@/shared/context/LanguageContext";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';
    const { cartCount } = useCart();
    const { user, setUser } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const { setCart } = useContext(CartContext);
    const { lang, setLanguage, t } = useLanguage();

    const handleLogout = async () => {
        try {
            await logoutApi();
            notify.success(lang === 'vi' ? 'Đã đăng xuất thành công' : 'Logged out successfully');
            setUser(null);
            setCart(null);
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error("Logout error:", error);
            const message = error.response?.data?.message || (lang === 'vi' ? "Đăng xuất thất bại" : "Logout failed");
            notify.error(message);
        }
    };

    const toggleLanguage = () => {
        const nextLang = lang === 'vi' ? 'en' : 'vi';
        setLanguage(nextLang);
    };

    return (
        <header className={styles.headerWrapper}>
            {/* Top Bar / Mini Utility Header */}
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.topBarLeft}>
                        <Link to={user?.role === 'Seller' ? ROUTES.SELLER_DASHBOARD : "/seller/register"} className={styles.topBarLink}>
                            <FiShoppingBag size={13} />
                            <span>{t('sellerCenter')}</span>
                        </Link>
                        <span className={styles.divider}>|</span>
                        <span className={styles.topBarText}>{t('downloadApp')}</span>
                        <span className={styles.divider}>|</span>
                        <span className={styles.topBarText}>{t('connectSocial')}</span>
                    </div>

                    <div className={styles.topBarRight}>
                        <div className={styles.topBarLink}>
                            <FiPhoneCall size={13} />
                            <span>{t('hotline')}</span>
                        </div>
                        <span className={styles.divider}>|</span>
                        
                        {/* Multilingual Switcher VI / EN */}
                        <div 
                            className={styles.topBarLink} 
                            onClick={toggleLanguage} 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            title="Đổi ngôn ngữ / Change language"
                        >
                            <FiGlobe size={13} />
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                {lang === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}
                            </span>
                        </div>

                        <span className={styles.divider}>|</span>
                        {!user && (
                            <div className={styles.authLinks}>
                                <Link to={ROUTES.REGISTER} className={styles.topBarAuthLink}>{t('register')}</Link>
                                <span className={styles.divider}>|</span>
                                <Link to={ROUTES.LOGIN} className={styles.topBarAuthLink}>{t('login')}</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Header Container */}
            <div className={styles.mainHeader}>
                <div className={styles.mainHeaderInner}>
                    {/* Brand Logo & Name (PolarisX Mall) */}
                    <Link to={ROUTES.HOME} className={styles.brandLogoLink} title="PolarisX Mall - Trang chủ">
                        <img src="/logo.png" alt="PolarisX Mall Logo" className={styles.logoImage} />
                        <div className={styles.brandTextWrapper}>
                            <span className={styles.brandNamePrimary}>Polaris</span>
                            <span className={styles.brandNameHighlight}>X</span>
                            <span className={styles.brandNameSub}>Mall</span>
                        </div>
                    </Link>

                    {/* Central Search Section */}
                    <div className={styles.searchSection}>
                        <SearchBar initialQuery={initialQuery} placeholder={t('searchPlaceholder')} />
                        <div className={styles.popularTags}>
                            <span>{t('searchSuggestions')}</span>
                            <Link to="/products?q=Áo+khoác" className={styles.tagLink}>Áo khoác</Link>
                            <Link to="/products?q=Điện+thoại" className={styles.tagLink}>Điện thoại</Link>
                            <Link to="/products?q=Tai+nghe" className={styles.tagLink}>Tai nghe</Link>
                            <Link to="/products?q=Giày" className={styles.tagLink}>Giày thể thao</Link>
                        </div>
                    </div>

                    {/* Right User & Cart Actions */}
                    <div className={styles.actionsSection}>
                        {user && <SellerHeaderAction />}

                        {/* Cart Widget */}
                        <div
                            className={styles.cartWidget}
                            onClick={() => navigate(ROUTES.CART)}
                            role="button"
                            aria-label="Shopping Cart"
                            title={t('cart')}
                        >
                            <div className={styles.cartIconWrapper}>
                                <FiShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className={styles.cartBadge}>
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </div>
                            <span className={styles.cartLabel}>{t('cart')}</span>
                        </div>

                        {/* User Profile Widget */}
                        {user && (
                            <div className={styles.userDropdownWrapper}>
                                <div
                                    className={styles.userInfo}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img
                                        src={user.avatar || 'https://via.placeholder.com/35'}
                                        alt={user.fullName}
                                        className={styles.userAvatar}
                                    />
                                    <span className={styles.userName}>{user.fullName}</span>
                                    <FiChevronDown size={14} className={styles.chevron} />
                                </div>

                                {showDropdown && (
                                    <div className={styles.dropdownMenu}>
                                        <Link to={ROUTES.MY_ORDERS} className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                            <FiUser size={16} />
                                            <span>{t('myOrders')}</span>
                                        </Link>
                                        <Link to={ROUTES.PROFILE} className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                            <FiUser size={16} />
                                            <span>{t('myProfile')}</span>
                                        </Link>
                                        <button onClick={handleLogout} className={styles.logoutBtn}>
                                            <FiLogOut size={16} />
                                            <span>{t('logout')}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
