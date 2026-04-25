/** @summary Displays product info (image, pricing, rating) 
 * and handles add-to-cart action. */

import styles from './ProductCard.module.css'
import { useNavigate } from "react-router-dom";
import { IoStar, IoStarHalf, IoCartOutline } from "react-icons/io5";
import { ROUTES } from "@/config/route.config";

export default function ProductCard({ product, onBuy }) {

    const navigate = useNavigate();

    const {
        name,
        imageUrl,
        price,
        discountPrice,
        ratingAvg,
        stock,
        ratingCount,
        isTopSeller = true
    } = product;

    const discountPercent = price && discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    const handleGoDetail = () => {
        console.log("CLICK PRODUCT:", product);
        navigate(ROUTES.PRODUCT_DETAIL, { slug: product.slug });
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
                    {isTopSeller && <span className={styles.badge}>Top seller</span>}
                    <h2 className={styles.name}>{name || "Product name"}</h2>
                </div>

                <div className={styles.priceRow}>
                    <div className={styles.priceValue}>
                        {discountPrice ? (
                            <>
                                <span className={styles.oldPrice}>${price.toFixed(2)}</span>
                                <span className={styles.currentPrice}>${discountPrice.toFixed(2)}</span>
                                <span className={styles.discountTag}>-{discountPercent}%</span>
                            </>
                        ) : (
                            <span className={styles.currentPrice}>${price.toFixed(2)}</span>
                        )}
                    </div>

                    <button className={styles.cartBtn} onClick={(e) => {
                        e.stopPropagation();
                        onBuy?.(product);
                    }}>
                        <IoCartOutline />
                    </button>
                </div>

                <div className={styles.ratingRow}>
                    <div className={styles.stars}>
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStarHalf />
                    </div>
                    <span className={styles.ratingText}>
                        <strong>{ratingAvg}</strong> ({ratingCount} reviews)
                    </span>
                </div>
            </div>

        </div>
    )
}