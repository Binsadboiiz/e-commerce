import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    FiShoppingCart, 
    FiUser, 
    FiLogOut, 
    FiPhoneCall, 
    FiGlobe, 
    FiChevronDown, 
    FiShoppingBag,
    FiMenu
} from 'react-icons/fi';
import styles from './Header.module.css';
import SearchBar from "@/apps/customer/features/product/components/list/search/SearchBar";
import { useCart } from "@/apps/customer/features/cart/hooks/useCart";
import { AuthContext } from "@/shared/features/auth/context/AuthContext";
import { logoutApi } from "@/shared/features/auth/api/authService";
import { ROUTES } from "@/config/route.config";
import { notify } from "@/shared/utils/Notify";
import CartContext from "@/apps/customer/features/cart/context/CartContext";
import { useLanguage } from "@/shared/context/LanguageContext";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';
    const { cartCount } = useCart();
    const { user, setUser } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setCart } = useContext(CartContext);
    const { lang, setLanguage, t } = useLanguage();

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.warn("Logout API error:", error);
        } finally {
            setUser(null);
            if (setCart) setCart(null);
            notify.success(lang === 'vi' ? 'Đã đăng xuất thành công' : 'Logged out successfully');
            navigate(ROUTES.HOME);
        }
    };

    const toggleLanguage = () => {
        const nextLang = lang === 'vi' ? 'en' : 'vi';
        setLanguage(nextLang);
    };

    return (
        <header className={styles.headerWrapper}>
            {/* Top Bar / Mini Utility Header (Desktop Only) */}
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.topBarLeft}>
                        <Link to={user?.role === 'Seller' ? ROUTES.SELLER_DASHBOARD : ROUTES.SELLER_REGISTRATION} className={styles.topBarLink}>
                            <FiShoppingBag size={13} />
                            <span>{t('sellerCenter')}</span>
                        </Link>
                        <span className={styles.divider}>|</span>
                        <Link to={ROUTES.SELLER_REGISTRATION} className={styles.topBarLink}>
                            <span>{t('header.becomeSeller') || 'Trở Thành Người Bán'}</span>
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

            {/* Main Header Container - ROW 1 */}
            <div className={styles.mainHeader}>
                <div className={styles.mainHeaderInner}>
                    {/* Brand Logo & Name */}
                    <Link to={ROUTES.HOME} className={styles.brandLogoLink} title="PolarisX Mall - Trang chủ">
                        <img src="/logo.png" alt="PolarisX Mall Logo" className={styles.logoImage} width="160" height="38" />
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
                            <Link to="/products?categoryIds=3" className={styles.tagLink}>Áo khoác</Link>
                            <Link to="/products?categoryIds=1" className={styles.tagLink}>Điện thoại</Link>
                            <Link to="/products?categoryIds=2" className={styles.tagLink}>Laptop</Link>
                            <Link to="/products?categoryIds=6" className={styles.tagLink}>Giày thể thao</Link>
                        </div>
                    </div>

                    {/* Right User & Cart Actions */}
                    <div className={styles.actionsSection}>
                        {/* Cart Widget */}
                        <div
                            className={styles.cartWidget}
                            onClick={() => navigate(ROUTES.CART)}
                            role="button"
                            aria-label="Shopping Cart"
                        >
                            <div className={styles.cartIconWrapper}>
                                <FiShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className={styles.cartBadge}>
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* User Profile Widget */}
                        {user ? (
                            <div className={styles.userDropdownWrapper}>
                                <div
                                    className={styles.userInfo}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.fullName}
                                            className={styles.userAvatar}
                                        />
                                    ) : (
                                        <div className={styles.userAvatarFallback}>
                                            <FiUser size={16} />
                                        </div>
                                    )}
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
                        ) : (
                            <Link to={ROUTES.LOGIN} className={styles.guestIconMobileOnly} aria-label="Login">
                                <FiUser size={22} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ROW 2 Mobile Only - Burger Navigation */}
                <div className={styles.mobileRow2}>
                    <button 
                        className={styles.burgerBtn} 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <FiMenu size={22} />
                        <span>Menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Burger Menu Overlay/Dropdown */}
            {isMobileMenuOpen && (
                <nav className={styles.mobileBurgerMenu}>
                    <Link to={ROUTES.HOME} className={styles.burgerItem} onClick={() => setIsMobileMenuOpen(false)}>
                        {t('home')}
                    </Link>
                    <Link to={user?.role === 'Seller' ? ROUTES.SELLER_DASHBOARD : "/seller/register"} className={styles.burgerItem} onClick={() => setIsMobileMenuOpen(false)}>
                        <FiShoppingBag size={18} /> {t('sellerCenter')}
                    </Link>
                    <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className={styles.burgerItem}>
                        <FiGlobe size={18} /> {lang === 'vi' ? 'English (EN)' : 'Tiếng Việt (VI)'}
                    </button>
                    <div className={styles.burgerItem}>
                        <FiPhoneCall size={18} /> {t('hotline')}
                    </div>
                    {user && (
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={styles.burgerItem} style={{ color: 'var(--color-danger)' }}>
                            <FiLogOut size={18} /> {t('logout')}
                        </button>
                    )}
                </nav>
            )}
        </header>
    );
}

export default Header;
