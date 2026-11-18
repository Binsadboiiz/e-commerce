import React, { useContext, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { AuthContext } from "@/shared/features/auth/context/AuthContext";
import { logoutApi } from "@/shared/features/auth/api/authService";
import { ROUTES } from "@/config/route.config";
import { notify } from "@/shared/utils/Notify";
import CartContext from "@/apps/customer/features/cart/context/CartContext";
import styles from './SellerRegistrationLayout.module.css';

export default function SellerRegistrationLayout() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const { setCart } = useContext(CartContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutApi();
            notify.success('Logout successfully');
            setUser(null);
            setCart(null);
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Logout failed";
            notify.error(message);
        }
    };

    return (
        <div className={styles.layout}>
            {/* Simplified Onboarding Header */}
            <header className={styles.headerContainer}>
                <Link to={ROUTES.HOME} className={styles.logo}>
                    <h1 className={styles.logoText}>LOGO</h1>
                </Link>

                {user && (
                    <div className={styles.userSection}>
                        <div
                            className={styles.userInfo}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <span className={styles.userName}>{user.fullName}</span>
                            <img
                                src={user.avatar || 'https://via.placeholder.com/35'}
                                alt={user.fullName}
                                className={styles.avatar}
                            />
                        </div>

                        {showDropdown && (
                            <div className={styles.dropdown}>
                                <Link to={ROUTES.MY_ORDERS} className={styles.profile}>
                                    <FiUser size={16} />
                                    <span>My Orders</span>
                                </Link>
                                <Link to={ROUTES.PROFILE} className={styles.profile}>
                                    <FiUser size={16} />
                                    <span>Profile</span>
                                </Link>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    <FiLogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Content Area */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}
