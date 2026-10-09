/** @summary Displays product info (image, pricing, rating) with clean UI/UX. */

import styles from './ProductCard.module.css';
import { useNavigate } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoEyeOutline } from 'react-icons/io5';
import { ROUTES } from '@/config/route.config';
import formatPrice from '@/apps/customer/features/product/utils/formatPrice';
import { useLanguage } from '@/shared/context/LanguageContext';
import OptimizedImage from '@/shared/components/ui/OptimizedImage';

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

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    
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
        availableStock,
        stock,
    } = product;

    // HIDE OUT-OF-STOCK PRODUCTS
    const currentStock = availableStock ?? stock ?? 0;
    if (currentStock <= 0) return null;

    const discountPercent = price && discountPrice && price > discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    const handleGoDetail = () => {
        if (product.slug) {
            navigate(ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug));
        }
    };

    return (
        <div className={styles.productCard} onClick={handleGoDetail} role="button" tabIndex={0}>
            {/* IMAGE SECTION */}
            <div className={styles.imageWrapper}>
                {imageUrl ? (
                    <OptimizedImage
                        src={imageUrl}
                        alt={name}
                        className={styles.productImg}
                        widths={[240, 384, 480]}
                        sizes="(max-width: 480px) 480px, (max-width: 768px) 384px, 240px"
                        crop="fill"
                    />
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
                        {soldCount > 0 && <span className={styles.soldText}> • Đã bán {soldCount}</span>}
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
                </div>
            </div>
        </div>
    );
}