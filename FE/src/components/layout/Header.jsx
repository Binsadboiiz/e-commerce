import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import styles from './Header.module.css';
import SearchBar from '../../features/search/SearchBar';

function Header() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';

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

                <div className={styles.cart}>
                    <FaShoppingCart />
                    <span className={styles.badge}>99+</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
