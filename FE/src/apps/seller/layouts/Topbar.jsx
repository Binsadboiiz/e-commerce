import styles from "./Topbar.module.css";
import { Search, Sun, Bell } from "lucide-react";

function Topbar() {
    return (
        <header className={styles.topbar}>
            <div className={styles.inner}>

                {/* search */}
                <div className={styles.searchBar}>
                    <Search size={16} className={styles.icon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search anything..."
                    />
                </div>

                {/* actions */}
                <div className={styles.actions}>

                    <button className={styles.circleBtn}>
                        <Sun size={16} />
                    </button>

                    <button className={styles.circleBtn}>
                        <Bell size={16} />
                    </button>

                    <div className={styles.user}>

                        <div className={styles.meta}>
                            <span className={styles.userText}>
                                Hello, <strong>Adam</strong>
                            </span>

                            <span className={styles.badge}>
                                Seller
                            </span>
                        </div>

                        <div className={styles.avatar}>

                        </div>

                    </div>

                </div>

            </div>
        </header>
    );
}

export default Topbar;