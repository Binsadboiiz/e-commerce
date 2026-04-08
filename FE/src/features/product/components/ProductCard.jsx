import styles from './ProductCard.module.css'
import { IoStar } from "react-icons/io5";

export default function ProductCard({ product, onBuy }) {

    const {
        title,
        price,
        discountPercentage,
        thumbnail,
        rating,
        stock
    } = product;

    const discountPrice = discountPercentage
        ? (price - (price * discountPercentage) / 100).toFixed(2)
        : null;

    return (

        <div className={styles.productCard}>
            <div className={styles.img}>
                {thumbnail ? <img src={thumbnail} alt={title} /> : <div className={styles.img} />}
            </div>

            <div className={styles.name}>
                <h2>{title}</h2>
            </div>

            <span className={styles.rating}>
                <IoStar />{rating}
            </span>

            <span className={styles.price}>
                {discountPrice ? (
                    <>
                        <del>${price}</del> ${discountPrice}
                    </>
                ) : (
                    <>${price}</>
                )}
            </span>

            <span className={styles.sold}>
                Stock: {stock}
            </span>

            <button
                className={styles.btnBuy}
                disabled={stock === 0}
                onClick={() => onBuy?.(product)}
            >
                {stock === 0 ? "Out of stock" : "Buy now"}
            </button>
        </div>
    )
}