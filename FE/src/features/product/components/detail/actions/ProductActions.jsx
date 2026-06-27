import { IoCartOutline } from "react-icons/io5";
import styles from "./ProductActions.module.css";

export default function ProductActions({
    selectedVariant,
    quantity,
    setQuantity,
    onBuyNow,
    onAddToCart,
}) {
    const stock = selectedVariant?.availableStock ?? 0;

    const isOutOfStock =
        !selectedVariant ||
        !selectedVariant.isAvailable ||
        stock <= 0;

    const decrease = () => {
        setQuantity((q) => Math.max(1, q - 1));
    };

    const increase = () => {
        setQuantity((q) => Math.min(stock, q + 1));
    };

    return (
        <div className={styles.actions}>
            <div className={styles.quantity}>
                <button
                    type="button"
                    onClick={decrease}
                    disabled={quantity <= 1}
                >
                    -
                </button>

                <input
                    type="number"
                    value={quantity}
                    readOnly
                />

                <button
                    type="button"
                    onClick={increase}
                    disabled={isOutOfStock || quantity >= stock}
                >
                    +
                </button>
            </div>

            <button
                type="button"
                className={styles.addCartBtn}
                disabled={isOutOfStock}
                onClick={onAddToCart}
            >
                <IoCartOutline />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
                type="button"
                className={styles.buyBtn}
                disabled={isOutOfStock}
                onClick={onBuyNow}
            >
                Buy Now
            </button>
        </div>
    );
}