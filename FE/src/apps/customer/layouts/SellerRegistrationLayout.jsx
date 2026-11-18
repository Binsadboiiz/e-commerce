import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { AuthContext } from "@/shared/features/auth/context/AuthContext";
import { logoutApi } from "@/shared/features/auth/api/authService";
import { ROUTES } from "@/config/route.config";
import { notify } from "@/shared/utils/Notify";
import CartContext from "@/apps/customer/features/cart/context/CartContext";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from './SellerRegistrationLayout.module.css';

export default function SellerRegistrationLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useContext(AuthContext);
    const { setCart } = useContext(CartContext);
    const { t, lang, setLanguage } = useLanguage();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const isSetupShop = location.pathname.includes('setup-shop');
    const headerTitle = isSetupShop 
        ? t("sellerShopSetup.setupHeader") 
        : t("sellerOnboarding.onboardingHeader");

    const toggleLanguage = () => {
        const nextLang = lang === 'vi' ? 'en' : 'vi';
        setLanguage(nextLang);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.layout}>
            {/* Clean Seller Onboarding Header matching System Design */}
            <header className={styles.headerContainer}>
                <div className={styles.headerLeft}>
                    <Link to={ROUTES.HOME} className={styles.brandLogoLink} title="PolarisX Mall - Trang chủ">
                        <img src="/logo.png" alt="PolarisX Mall Logo" className={styles.logoImage} width="160" height="38" />
                        <div className={styles.brandTextWrapper}>
                            <span className={styles.brandNamePrimary}>Polaris</span>
                            <span className={styles.brandNameHighlight}>X</span>
                            <span className={styles.brandNameSub}>Mall</span>
                        </div>
                    </Link>

                    <div className={styles.headerDivider} />

                    <span className={styles.sellerOnboardingText}>{headerTitle}</span>
                </div>

                <div className={styles.headerRight}>
                    <Link to={ROUTES.HOME} className={styles.homeLink}>
                        <span>{lang === 'vi' ? 'Trang chủ' : 'Home'}</span>
                    </Link>

                    {/* VI / EN Language Switcher */}
                    <button
                        type="button"
                        className={styles.langToggleBtn}
                        onClick={toggleLanguage}
                        title={lang === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
                    >
                        <span className={styles.langBadge}>{lang === 'vi' ? 'VI' : 'EN'}</span>
                    </button>

                    {user && (
                        <div className={styles.userSection} ref={dropdownRef}>
                            <button
                                type="button"
                                className={styles.userInfo}
                                onClick={() => setShowDropdown(!showDropdown)}
                                aria-expanded={showDropdown}
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.fullName || user.username}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarFallback}>
                                        {getInitials(user.fullName || user.username)}
                                    </div>
                                )}
                                <span className={styles.userName}>{user.fullName || user.username}</span>
                                <FiChevronDown size={14} className={`${styles.chevron} ${showDropdown ? styles.chevronOpen : ''}`} />
                            </button>

                            {showDropdown && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <p className={styles.userFullName}>{user.fullName || user.username}</p>
                                        <p className={styles.userEmail}>{user.email}</p>
                                    </div>
                                    <div className={styles.dropdownDivider} />
                                    <button onClick={handleLogout} className={styles.logoutBtn}>
                                        <span>{lang === 'vi' ? 'Đăng xuất' : 'Logout'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Content Area */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={styles.footerContainer}>
                <p>© 2026 PolarisX Mall Seller Center. All rights reserved. Support: support@polarisx.com</p>
            </footer>
        </div>
    );
}
