import { useAuth } from "@/shared/features/auth/hooks/useAuth";
import styles from "./Topbar.module.css";
import { Search, Sun, Bell, Menu, Globe } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";

function Topbar({ onToggleSidebar }) {
    const { user } = useAuth();
    const { lang, setLanguage, t } = useLanguage();

    const toggleLang = () => {
        setLanguage(lang === 'vi' ? 'en' : 'vi');
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.inner}>
                
                <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle Menu">
                    <Menu size={20} />
                </button>

                {/* search */}
                <div className={styles.searchBar}>
                    <Search size={16} className={styles.icon} />
                    <input
                        className={styles.searchInput}
                        placeholder={t('header.searchPlaceholder')}
                    />
                </div>

                {/* actions */}
                <div className={styles.actions}>

                    <button 
                        className={styles.circleBtn} 
                        onClick={toggleLang} 
                        title="Đổi ngôn ngữ / Switch Language"
                    >
                        <Globe size={16} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: 4 }}>
                            {lang.toUpperCase()}
                        </span>
                    </button>

                    <button className={styles.circleBtn}>
                        <Bell size={16} />
                    </button>

                    <div className={styles.user}>

                        <div className={styles.meta}>
                            <span className={styles.userText}>
                                Hello, <strong>{user?.fullName || "Seller"}</strong>
                            </span>

                            <span className={styles.badge}>
                                {user?.role || "Seller"}
                            </span>
                        </div>

                        <div className={styles.avatar}>
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.fullName} className={styles.avatarImg} />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {(user?.fullName || "?").charAt(0).toUpperCase()}
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