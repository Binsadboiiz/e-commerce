/** @summary Displays product info (image, pricing, rating)
 * and handles add-to-cart action. */

import styles from './ProductCard.module.css';
import { useNavigate } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoCartOutline } from 'react-icons/io5';
import { ROUTES } from '@/config/route.config';
import { useCart } from '@/apps/customer/features/cart/hooks/useCart';
import { notify } from '@/shared/utils/Notify';
import formatPrice from '@/apps/customer/features/product/utils/formatPrice';

/* Renders up to 5 star icons based on numeric ratingAvg */
function Stars({ value = 0 }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

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

    const {
        name,
        imageUrl,
        price,
        discountPrice,
        ratingAvg,
        ratingCount,
        isTopSeller,
    } = product;

    const discountPercent = price && discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    const handleGoDetail = () => {
        navigate(ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug));
    };

    const handleCartClick = async (e) => {
        e.stopPropagation();
        if (onBuy) {
            onBuy(product);
            return;
        }
        try {
            await addToCart(product.productId || product.id, 1, null);
            notify.success(`Added ${name} to cart!`);
        } catch (err) {
            console.error("Failed to add to cart:", err);
            if (err.response?.status === 401) {
                notify.error("Please login to add products to cart.");
            } else {
                notify.error("Could not add product to cart.");
            }
        }
    };

    return (
        <div className={styles.productCard} onClick={handleGoDetail}>

            <div className={styles.imageWrapper}>
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className={styles.productImg} />
                ) : (
                    <div className={styles.placeholderImg} />
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.headerRow}>
                    {isTopSeller && (
                        <span className={styles.badge}>Top seller</span>
                    )}
                    <h2 className={styles.name}>{name || 'Product name'}</h2>
                </div>

                <div className={styles.priceRow}>
                    <div className={styles.priceValue}>
                        {discountPrice ? (
                            <>
                                <span className={styles.oldPrice}>
                                    {formatPrice(price)}
                                </span>
                                <span className={styles.currentPrice}>
                                    {formatPrice(discountPrice)}
                                </span>
                                <span className={styles.discountTag}>
                                    -{discountPercent}%
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
                        aria-label={`Add ${name} to cart`}
                        onClick={handleCartClick}
                    >
                        <IoCartOutline />
                    </button>
                </div>

                <div className={styles.ratingRow}>
                    <Stars value={ratingAvg} />
                    <span className={styles.ratingText}>
                        <strong>{ratingAvg}</strong> ({ratingCount} reviews)
                    </span>
                </div>
            </div>

        </div>
    );
}