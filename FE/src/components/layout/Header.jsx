import styles from './Header.module.css'
import { FaSearch, FaShoppingCart, BsChatDots } from "react-icons/fa";

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
                <div className={styles.searchBox}>
                    <select className={styles.filter}>
                        <option>All</option>
                    </select>

                    <input type="text" placeholder="Search" />
                    <FaSearch className={styles.icon}/>
                </div>
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
