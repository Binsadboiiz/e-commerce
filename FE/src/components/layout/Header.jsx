import { Profiler, useContext, useState } from 'react';
import { Link, useNavigate, useLocation, Route } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import styles from './Header.module.css';
import SearchBar from '../../features/product/components/list/search/SearchBar';
import { useCart } from '../../features/cart/hooks/useCart';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { logoutApi } from '../../features/auth/api/authService';
import { ROUTES } from '../../config/route.config.js';
import { notify } from '../../utils/Notify.js';
import CartContext from '../../features/cart/context/CartContext.jsx';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';
    const { cartCount } = useCart();
    const { user, setUser } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const { cart, setCart } = useContext(CartContext)
 
    const handleLogout = async () => {
        try {
            await logoutApi();
            notify.success('Logout successfully');
            setUser(null);
            setCart(null);
            navigate(ROUTES.HOME);
        } catch (error) {
            console.log(error);

        const message =
            error.response?.data?.message ||
            "Logout failed";

        notify.error(message);
        }
    };
 
    return (
        <header className={styles.headerContainer}>
            {/* LEFT */}
            <div className={styles.left}>
                <Link to={ROUTES.HOME} className={styles.logo}>
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
                            <span className={styles.userName}>{user.fullName}</span>
                            <img 
                                src={user.avatar || 'https://via.placeholder.com/35'} 
                                alt={user.fullName} 
                                className={styles.avatar} 
                            />
                        </div>
                        
                        {showDropdown && (
                            <div className={styles.dropdown}>
                                <Link to={ROUTES.PROFILE} className={styles.profile} >
                                    <FiUser size={16} style={{marginRight: "8px"}}/>
                                    <span> Profile</span>
                                </Link>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    <FiLogOut size={16} style={{marginRight: "8px"}}/>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ul className={styles.menu}>
                        <li><Link to={ROUTES.REGISTER} className={styles.menuLink}>Sign up</Link></li>
                        <li><Link to={ROUTES.LOGIN} className={styles.menuLink}>Login</Link></li>
                    </ul>
                )}
 
                <div
                    className={styles.cart}
                    onClick={() => navigate(ROUTES.CART)}
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
