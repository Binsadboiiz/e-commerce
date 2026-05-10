import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import styles from './Header.module.css';
import SearchBar from '@/features/product/components/list/search/SearchBar';
import { useCart } from '@/features/cart/hooks/useCart';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { logoutApi } from '@/features/auth/api/authService';
 
function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';
    const { cartCount } = useCart();
    const { user, setUser } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
 
    const handleLogout = async () => {
        try {
            await logoutApi();
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
 
    return (
        <header className={styles.headerContainer}>
            {/* LEFT */}
            <div className={styles.left}>
                <Link to="/" className={styles.logo}>
                    <h1 className={styles.logoText}>LOGO</h1>
                </Link>
            </div>
 
            {/* CENTER */}
            <div className={styles.center}>
                <SearchBar initialQuery={initialQuery} />
            </div>
 
            {/* RIGHT */}
            <div className={styles.right}>
                {user ? (
                    <div className={styles.userSection}>
                        <div 
                            className={styles.userInfo} 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <img 
                                src={user.avatar || 'https://via.placeholder.com/35'} 
                                alt={user.fullName} 
                                className={styles.avatar} 
                            />
                            <span className={styles.userName}>{user.fullName}</span>
                        </div>
                        
                        {showDropdown && (
                            <div className={styles.dropdown}>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    <FiLogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ul className={styles.menu}>
                        <li><Link to="/register" className={styles.menuLink}>Sign up</Link></li>
                        <li><Link to="/login" className={styles.menuLink}>Login</Link></li>
                    </ul>
                )}
 
                <div
                    className={styles.cart}
                    onClick={() => navigate('/cart')}
                    role="button"
                    aria-label="Shopping cart"
                >
                    <FiShoppingCart size={20} />
                    {cartCount > 0 && (
                        <span className={styles.badge}>
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
