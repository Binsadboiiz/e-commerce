import styles from './ProductCard.module.css'
import { IoStar } from "react-icons/io5";

export default function ProductCard({ product, onBuy }) {

    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL_IMAGE}`;

    const {
        name,
        imageUrl,
        price,
        discountPrice,
        ratingAvg,
        stock
    } = product;

    return (
        <div className={styles.productCard}>

            <div className={styles.img}>
                {imageUrl
                    ? <img src={imageUrl} alt={name} />
                    : <div className={styles.img} />
                }
            </div>

            <div className={styles.name}>
                <h2>{name}</h2>
            </div>

            <span className={styles.rating}>
                <IoStar /> {ratingAvg}
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