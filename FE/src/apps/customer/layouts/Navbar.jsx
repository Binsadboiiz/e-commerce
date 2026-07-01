import styles from "./Navbar.module.css"
import { IoMenu } from "react-icons/io5";

function NavBar() {
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.category}>
                <IoMenu className={styles.icon}/>
                <span className={styles.text}>List Categories</span>
            </div>
    </div>
    )
}

export default NavBar