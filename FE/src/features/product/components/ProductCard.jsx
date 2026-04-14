import styles from './ProductCard.module.css'
import { IoStar } from "react-icons/io5";

export default function ProductCard({ product, onBuy }) {

    const {
        name,
        image,
        price,
        discountPrice,
        ratingAvg,
        stock
    } = product;

    return (
        <div className={styles.productCard}>

            <div className={styles.img}>
                {image
                    ? <img src={image} alt={name} />
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