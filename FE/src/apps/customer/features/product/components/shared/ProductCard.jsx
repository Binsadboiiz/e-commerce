/** @summary Displays product info (image, pricing, rating)
 * and handles add-to-cart action. */

import styles from './ProductCard.module.css';
import { useNavigate } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline, IoCartOutline } from 'react-icons/io5';
import { ROUTES } from '@/config/route.config';

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
                                    ${price.toFixed(2)}
                                </span>
                                <span className={styles.currentPrice}>
                                    ${discountPrice.toFixed(2)}
                                </span>
                                <span className={styles.discountTag}>
                                    -{discountPercent}%
                                </span>
                            </>
                        ) : (
                            <span className={styles.currentPrice}>
                                ${price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        className={styles.cartBtn}
                        aria-label={`Add ${name} to cart`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onBuy?.(product);
                        }}
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