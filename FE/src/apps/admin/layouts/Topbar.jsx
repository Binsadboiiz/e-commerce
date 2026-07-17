import { useAuth } from "@/shared/features/auth/hooks/useAuth";
import styles from "./Topbar.module.css";
import { Search, Sun, Bell, Menu } from "lucide-react";

function Topbar({ onToggleSidebar }) {
    const { user } = useAuth();

    return (
        <header className={styles.topbar}>
            <div className={styles.inner}>
                
                <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle Menu">
                    <Menu size={20} />
                </button>

                {/* Thanh tìm kiếm */}
                <div className={styles.searchBar}>
                    <Search size={16} className={styles.icon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search admin panels..."
                    />
                </div>

                {/* Các nút chức năng */}
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
                                Hello, <strong>{user?.fullName || "Admin"}</strong>
                            </span>

                            <span className={styles.badge} style={{ backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" }}>
                                {user?.role || "Admin"}
                            </span>
                        </div>

                        <div className={styles.avatar}>
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.fullName} className={styles.avatarImg} />
                            ) : (
                                <div className={styles.avatarPlaceholder} style={{ backgroundColor: "#cbd5e1" }}>
                                    {(user?.fullName || "A").charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </header>
    );
}

export default Topbar;
