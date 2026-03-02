import styles from './ProductCard.module.css'

export default function ProductCard({ product, onBuy }) {
    
    const {
        title,
        thumbnail,
        price,
        discountPercentage,
        rating,
        stock
    } = product;

    const discountPrice = discountPercentage
        ? (price - (price * discountPercentage) / 100).toFixed(2)
        : null;

    return (
        <div className={styles.productCard}> 
            <div className={styles.img}>
                <img src={thumbnail} alt={title} />
            </div>

            <div className={styles.name}>
                <h2>{title}</h2>
            </div>

            <span className={styles.rating}>
                ⭐ {rating}
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