/** @summary Displays product info (image, pricing, rating)
 * and handles add-to-cart action with modern UI/UX. */

import styles from './ProductCard.module.css';
import { useNavigate } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoCartOutline, IoEyeOutline } from 'react-icons/io5';
import { ROUTES } from '@/config/route.config';
import { useCart } from '@/apps/customer/features/cart/hooks/useCart';
import { notify } from '@/shared/utils/Notify';
import formatPrice from '@/apps/customer/features/product/utils/formatPrice';
import { useLanguage } from '@/shared/context/LanguageContext';

/* Renders up to 5 star icons based on numeric ratingAvg */
function Stars({ value = 0 }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const empty = Math.max(0, 5 - full - (half ? 1 : 0));

    return (
        <div className={styles.stars} aria-label={`${value} out of 5 stars`}>
            {Array.from({ length: full }).map((_, i) => (
                <IoStar key={`f${i}`} />
            ))}
            {half && <IoStarHalf key="half" />}
            {Array.from({ length: empty }).map((_, i) => (
                <IoStarOutline key={`e${i}`} />
            ))}
        </div>
    );
}

export default function ProductCard({ product, onBuy }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    let t = (key) => key;
    try {
        const langCtx = useLanguage();
        if (langCtx?.t) t = langCtx.t;
    } catch {
        // Fallback if rendered outside LanguageProvider
    }

    if (!product) return null;

    const {
        name,
        imageUrl,
        price,
        discountPrice,
        ratingAvg = 4.5,
        ratingCount = 0,
        isTopSeller,
        brandName,
        soldCount,
    } = product;

    const discountPercent = price && discountPrice && price > discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    const handleGoDetail = () => {
        if (product.slug) {
            navigate(ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug));
        }
    };

    const handleCartClick = async (e) => {
        e.stopPropagation();
        if (onBuy) {
            onBuy(product);
            return;
        }
        try {
            await addToCart(product.productId || product.id, 1, null);
            notify.success(t('addedSuccess') || `Đã thêm ${name} vào giỏ hàng!`);
        } catch (err) {
            console.error("Failed to add to cart:", err);
            if (err.response?.status === 401) {
                notify.error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
            } else {
                notify.error("Không thể thêm sản phẩm vào giỏ hàng.");
            }
        }
    };

    return (
        <div className={styles.productCard} onClick={handleGoDetail} role="button" tabIndex={0}>
            {/* IMAGE SECTION */}
            <div className={styles.imageWrapper}>
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className={styles.productImg} loading="lazy" />
                ) : (
                    <div className={styles.placeholderImg}>
                        <IoEyeOutline className={styles.placeholderIcon} />
                    </div>
                )}

                {/* BADGES */}
                {isTopSeller && (
                    <span className={styles.topBadge}>
                        {t('topSeller') || 'TOP SELLER'}
                    </span>
                )}

                {discountPercent > 0 && (
                    <span className={styles.discountBadge}>
                        -{discountPercent}%
                    </span>
                )}

                {/* OVERLAY ACTION ON HOVER */}
                <div className={styles.quickActionOverlay}>
                    <button
                        className={styles.quickBuyBtn}
                        onClick={handleCartClick}
                        title={t('addToCart') || 'Thêm vào giỏ'}
                        aria-label={t('addToCart') || 'Thêm vào giỏ'}
                    >
                        <IoCartOutline /> <span>{t('addToCart') || 'Thêm vào giỏ'}</span>
                    </button>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className={styles.content}>
                {brandName && <div className={styles.brandTag}>{brandName}</div>}

                <h3 className={styles.name} title={name}>
                    {name || 'Tên sản phẩm'}
                </h3>

                <div className={styles.ratingRow}>
                    <Stars value={ratingAvg} />
                    <span className={styles.ratingText}>
                        <strong>{ratingAvg > 0 ? ratingAvg : 5.0}</strong>
                        {ratingCount > 0 && <span className={styles.countText}>({ratingCount})</span>}
                        {soldCount && <span className={styles.soldText}> • Đã bán {soldCount}</span>}
                    </span>
                </div>

                <div className={styles.priceRow}>
                    <div className={styles.priceContainer}>
                        {discountPrice ? (
                            <>
                                <span className={styles.currentPrice}>
                                    {formatPrice(discountPrice)}
                                </span>
                                <span className={styles.oldPrice}>
                                    {formatPrice(price)}
                                </span>
                            </>
                        ) : (
                            <span className={styles.currentPrice}>
                                {formatPrice(price)}
                            </span>
                        )}
                    </div>

                    <button
                        className={styles.cartBtn}
                        aria-label={`Thêm ${name} vào giỏ`}
                        onClick={handleCartClick}
                        title={t('addToCart') || 'Thêm vào giỏ'}
                    >
                        <IoCartOutline />
                    </button>
                </div>
            </div>
        </div>
    );
}