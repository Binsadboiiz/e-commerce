import styles from './Header.module.css'
import SearchBar from '../common/SearchBar';
import { FaSearch, FaShoppingCart } from "react-icons/fa";

function Header() {
    return (
        <header className={styles.headerContainer}>

            {/* LEFT */}
            <div className={styles.left}>
                <img src="" alt="" className={styles.logo}/>
                <h1 className={styles.logoText}>LOGO</h1>
            </div>

            {/* CENTER */}
            <div className={styles.center}>
                <SearchBar />
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
    )
}

export default Header
