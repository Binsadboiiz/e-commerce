import { FiTrash2 } from 'react-icons/fi';
import QuantityControl from './QuantityControl';
import { useCart } from '../hooks/useCart';
import styles from '../pages/CartPage.module.css';

export default function CartItem({ item }) {
    const { updateQuantity, removeItem, toggleSelectItem, isItemSelected } = useCart();
    const selected = isItemSelected(item.cartItemId);

    const effectivePrice = item.discountPrice ?? item.price;
    const hasDiscount = item.discountPrice != null && item.discountPrice < item.price;

    const handleQuantityChange = async (newQty) => {
        await updateQuantity(item.productId, newQty, item.variantId);
    };

    const handleRemove = async () => {
        await removeItem(item.productId, item.variantId);
    };

    return (
        <div className={styles.cartItem}>
            {/* Checkbox */}
            <div className="flex-shrink-0">
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelectItem(item.cartItemId)}
                        className={styles.checkboxInput}
                    />
                    <div className={styles.checkboxCustom}>
                        {selected && (
                            <svg className={styles.checkboxCheckmark} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </label>
            </div>

            {/* Product Image */}
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border bg-gray-50">
                <img
                    src={item.productImage || '/placeholder-product.png'}
                    alt={item.productName}
                    className="w-full h-full object-cover transition-transform duration-300
                               group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/f5f5f5/999?text=No+Img'; }}
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary truncate pr-4 leading-snug">
                    {item.productName}
                </h4>
                {item.variantName && (
                    <div className="mt-1.5">
                        <span className="inline-flex items-center text-xs text-text-secondary
                                         bg-gray-100 rounded px-2 py-0.5">
                            {item.variantName}: {item.variantValue}
                        </span>
                    </div>
                )}
            </div>

            {/* Unit Price */}
            <div className="w-28 text-center flex-shrink-0">
                {hasDiscount ? (
                    <div className="space-y-0.5">
                        <span className="text-xs text-text-secondary line-through block">
                            ${item.price.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-text-price">
                            ${item.discountPrice.toFixed(2)}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-text-primary">
                        ${item.price.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Quantity */}
            <div className="flex-shrink-0">
                <QuantityControl
                    value={item.quantity}
                    max={item.stock}
                    onChange={handleQuantityChange}
                />
            </div>

            {/* Subtotal */}
            <div className="w-28 text-right flex-shrink-0">
                <span className="text-sm font-semibold text-text-price">
                    ${item.subTotal.toFixed(2)}
                </span>
            </div>

            {/* Delete */}
            <div className="flex-shrink-0">
                <button
                    onClick={handleRemove}
                    className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10
                               rounded-lg transition-all duration-200"
                    aria-label="Remove item"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>
        </div>
    );
}
