import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import styles from './Header.module.css';
import SearchBar from '@/features/product/components/search/SearchBar';
import { useCart } from '@/features/cart/hooks/useCart';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';
    const { cartCount } = useCart();

    return (
        <header className={styles.headerContainer}>
            {/* LEFT */}
            <div className={styles.left}>
                <Link to="/" className={styles.logo}>
                    {/* <img src="" alt="" /> */}
                    <h1 className={styles.logoText}>LOGO</h1>
                </Link>
            </div>

            {/* CENTER */}
            <div className={styles.center}>
                <SearchBar initialQuery={initialQuery} />
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
                <ul className={styles.menu}>
                    <li>Sign up</li>
                    <li>Login</li>
                </ul>

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
