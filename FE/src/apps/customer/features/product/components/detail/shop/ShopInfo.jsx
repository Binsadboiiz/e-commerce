import { Link } from "react-router-dom";
import styles from "./ShopInfo.module.css";
import { ROUTES } from "@/config/route.config";
import { IoHomeOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useLanguage } from '@/shared/context/LanguageContext';

const DEFAULT_SHOP_AVATAR =
    "https://placehold.co/80x80/F3F4F6/6B7280?text=Shop";

function formatFollowers(value = 0) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
}

function formatJoined(date, lang) {
    if (!date) return "--";

    const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
        month: "short",
        year: "numeric",
    });
}

export default function ShopInfo({ shop }) {
    const { t, lang } = useLanguage();
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
                        {shop.isOnline ? (t('productDetail.online') || "Online") : (t('productDetail.offline') || "Offline")}
                    </div>

                    {/* View Shop*/}
                    <Link
                        to={ROUTES.SHOP.replace(":id", shop.shopId)}
                        className={styles.viewBtn}
                    >
                        <IoHomeOutline className={styles.svgIcon} />
                        {t('productDetail.viewShop') || "View Shop"}
                    </Link>
                </div>
            </div>

            {/* Cụm thông số */}
            <div className={styles.statsContainer}>
                
                {/* Cột dọc 1 */}
                <div className={styles.statsColumn}>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('productDetail.shopRating') || "Rating"}</span>
                        <strong className={styles.value}>{shop.rating?.toFixed(1) || "0.0"}</strong>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('productDetail.shopProducts') || "Products"}</span>
                        <strong className={styles.value}>{shop.productCount || 0}</strong>
                    </div>
                </div>

                {/* Cột dọc 2 */}
                <div className={styles.statsColumn}>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('productDetail.responseRate') || "Response Rate"}</span>
                        <strong className={styles.value}>{shop.responseRate || 0}%</strong>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('productDetail.responseTime') || "Response Time"}</span>
                        <strong className={styles.value}>{shop.responseTime || "--"}</strong>
                    </div>
                </div>

                {/* Cột dọc 3 */}
                <div className={styles.statsColumn}>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('productDetail.joined') || "Joined"}</span>
                        <strong className={styles.value}>{formatJoined(shop.joinedAt, lang)}</strong>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('productDetail.followers') || "Followers"}</span>
                        <strong className={styles.value}>{formatFollowers(shop.followers)}</strong>
                    </div>
                </div>

            </div>

            {/* Phía ngoài cùng */}
            <div className={styles.actionContainer}>
                <button className={styles.chatBtn}>
                    <IoChatbubbleEllipsesOutline className={styles.svgIcon} />
                    {t('productDetail.chatNow') || "Chat now"}
                </button>
            </div>

        </section>
    );
}