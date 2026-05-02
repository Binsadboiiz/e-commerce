import { IoCartOutline } from "react-icons/io5";
import styles from './ProductActions.module.css'

export default function ProductActions({ product, onBuyNow, onAddToCart }) {

    return (
        <div className={styles.actions}>

            <button
                className={styles.addCartBtn}
                onClick={() => onAddToCart?.(product)}
            >
                <IoCartOutline />
                Add to Cart
            </button>

            <button
                className={styles.buyBtn}
                onClick={() => onBuyNow?.(product)}
            >
                Buy Now
            </button>

        </div>
    )
}