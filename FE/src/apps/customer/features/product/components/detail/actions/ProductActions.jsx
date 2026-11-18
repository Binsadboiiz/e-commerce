import { IoCartOutline } from "react-icons/io5";
import styles from "./ProductActions.module.css";
import { useLanguage } from '@/shared/context/LanguageContext';

export default function ProductActions({
    selectedVariant,
    quantity,
    setQuantity,
    onBuyNow,
    onAddToCart,
}) {
    const { t } = useLanguage();
    const stock = selectedVariant?.availableStock ?? 0;

    const isOutOfStock =
        !selectedVariant ||
        !selectedVariant.isAvailable ||
        stock <= 0;

    const decrease = () => {
        setQuantity((q) => Math.max(1, Number(q || 1) - 1));
    };

    const increase = () => {
        setQuantity((q) => Math.min(stock, Number(q || 1) + 1));
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setQuantity('');
            return;
        }
        const num = parseInt(val, 10);
        if (!isNaN(num)) {
            if (num > stock) setQuantity(stock);
            else if (num < 1) setQuantity(1);
            else setQuantity(num);
        }
    };

    const handleInputBlur = () => {
        if (!quantity || Number(quantity) < 1) {
            setQuantity(1);
        } else if (Number(quantity) > stock) {
            setQuantity(stock);
        }
    };

    return (
        <div className={styles.actions}>
            <div className={styles.quantity}>
                <button
                    type="button"
                    onClick={decrease}
                    disabled={Number(quantity || 1) <= 1}
                >
                    -
                </button>

                <input
                    type="number"
                    min={1}
                    max={stock}
                    value={quantity}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
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
                {isOutOfStock ? (t('productDetail.outOfStock') || "Out of Stock") : (t('productDetail.addToCart') || "Add to Cart")}
            </button>

            <button
                type="button"
                className={styles.buyBtn}
                disabled={isOutOfStock}
                onClick={onBuyNow}
            >
                {t('productDetail.buyNow') || "Buy Now"}
            </button>
        </div>
    );
}