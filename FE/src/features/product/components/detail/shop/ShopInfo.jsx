import { Link } from "react-router-dom";
import styles from "./ShopInfo.module.css";
import { ROUTES } from "@/config/route.config";

const DEFAULT_SHOP_AVATAR =
    "https://placehold.co/80x80/F3F4F6/6B7280?text=Shop";

function formatFollowers(value = 0) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
}

function formatJoined(date) {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

export default function ShopInfo({ shop }) {
    if (!shop) return null;

    return (
        <section className={styles.wrapper}>
            
            {/* Thông tin Shop */}
            <div className={styles.shopMeta}>
                <img
                    src={shop.shopAvatar || DEFAULT_SHOP_AVATAR}
                    alt={shop.shopName}
                    className={styles.avatar}
                    onError={(e) => {
                        e.currentTarget.src = DEFAULT_SHOP_AVATAR;
                    }}
                />

                <div className={styles.info}>
                    <h3 className={styles.name}>{shop.shopName}</h3>

                    <div className={styles.status}>
                        <span
                            className={
                                shop.isOnline ? styles.online : styles.offline
                            }
                        />
                        {shop.isOnline ? "Online" : "Offline"}
                    </div>

                    {/* View Shop*/}
                    <Link
                        to={ROUTES.SHOP.replace(":id", shop.shopId)}
                        className={styles.viewBtn}
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: '4px', fill: 'currentColor', verticalAlign: 'middle' }}>
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        View Shop
                    </Link>
                </div>
            </div>

            {/* Cụm thông số */}
            <div className={styles.statsContainer}>
                
                {/* Cột dọc 1 */}
                <div className={styles.statsColumn}>
                    <div className={styles.item}>
                        <span className={styles.label}>Rating</span>
                        <strong className={styles.value}>{shop.rating?.toFixed(1) || "0.0"}</strong>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>Products</span>
                        <strong className={styles.value}>{shop.productCount || 0}</strong>
                    </div>
                </div>

                {/* Cột dọc 2 */}
                <div className={styles.statsColumn}>
                    <div className={styles.item}>
                        <span className={styles.label}>Response Rate</span>
                        <strong className={styles.value}>{shop.responseRate || 0}%</strong>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>Response Time</span>
                        <strong className={styles.value}>{shop.responseTime || "--"}</strong>
                    </div>
                </div>

                {/* Cột dọc 3 */}
                <div className={styles.statsColumn}>
                    <div className={styles.item}>
                        <span className={styles.label}>Joined</span>
                        <strong className={styles.value}>{formatJoined(shop.joinedAt)}</strong>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>Followers</span>
                        <strong className={styles.value}>{formatFollowers(shop.followers)}</strong>
                    </div>
                </div>

            </div>

            {/* Phía ngoài cùng */}
            <div className={styles.actionContainer}>
                <button className={styles.chatBtn}>
                    {/* Btn chat */}
                    <svg viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: '6px', fill: 'currentColor', verticalAlign: 'middle' }}>
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    Chat now
                </button>
            </div>

        </section>
    );
}