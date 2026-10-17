import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import QuantityControl from './QuantityControl';
import { useCart } from '../hooks/useCart';
import styles from '../pages/CartPage.module.css';
import formatPrice from '@/apps/customer/features/product/utils/formatPrice';
import OptimizedImage from '@/shared/components/ui/OptimizedImage';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function CartItem({ item }) {
    const { updateQuantity, removeItem, toggleSelectItem, isItemSelected, isItemAvailable } = useCart();
    const { t } = useLanguage();
    const selected = isItemSelected(item.cartItemId);
    const available = isItemAvailable(item);
    const outOfStock = Number(item.stock) <= 0;

    const hasDiscount = item.discountPrice != null && item.discountPrice < item.price;

    const handleQuantityChange = async (newQty) => {
        const quantity = item.quantity > item.stock && newQty < item.quantity
            ? Math.min(newQty, item.stock)
            : newQty;
        await updateQuantity(item.productId, quantity, item.variantId);
    };

    const handleRemove = async () => {
        await removeItem(item.productId, item.variantId);
    };

    return (
        <div className={`${styles.cartItem} ${outOfStock ? styles.cartItemUnavailable : ''}`}>
            {/* Checkbox */}
            <div className="flex-shrink-0">
                <label className={`${styles.checkboxContainer} ${!available ? styles.checkboxDisabled : ''}`}>
                    <input
                        type="checkbox"
                        checked={selected}
                        disabled={!available}
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
            <div className={`${styles.productImage} flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border bg-gray-50`}>
                <OptimizedImage
                    src={item.productImage || '/placeholder-product.png'}
                    alt={item.productName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/f5f5f5/999?text=No+Img'; }}
                    width={80}
                    height={80}
                    crop="fill"
                />
            </div>

            {/* Product Info */}
            <div className={`${styles.productInfo} flex-1 min-w-0`}>
                <h4 className={`${styles.productName} text-sm font-medium text-text-primary truncate pr-4 leading-snug`}>
                    {item.productName}
                </h4>
                {item.variantName && (
                    <div className={`${styles.variantInfo} mt-1.5`}>
                        <span className="inline-flex items-center text-xs text-text-secondary
                                         bg-gray-100 rounded px-2 py-0.5">
                            {item.variantName}: {item.variantValue}
                        </span>
                    </div>
                )}
                {!outOfStock && !available && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600" role="status">
                        {t('cart.stockReduced', { count: item.stock })}
                    </p>
                )}
            </div>

            {outOfStock && (
                <div className={styles.stockWarning} role="alert">
                    <FiAlertTriangle size={16} aria-hidden="true" />
                    <span className={styles.stockWarningContent}>
                        {t('cart.unavailableNotice')}{' '}
                        <button type="button" onClick={handleRemove}>
                            {t('cart.removeFromCart')}
                        </button>
                    </span>
                </div>
            )}

            {/* Quantity */}
            {!outOfStock && (
                <div className={`${styles.quantityCell} flex-shrink-0`}>
                    <QuantityControl
                        value={item.quantity}
                        max={item.stock}
                        onChange={handleQuantityChange}
                    />
                </div>
            )}

            {/* Quantity-based total replaces the unit-price and duplicate subtotal display. */}
            {!outOfStock && (
                <div className={`${styles.subtotalCell} w-28 text-right flex-shrink-0`}>
                    <span className="text-sm font-semibold text-text-price">
                        {formatPrice(item.subTotal)}
                    </span>
                    {hasDiscount && (
                        <span className={`${styles.saleBadge} inline-flex rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600`}>
                            -{Math.round(((item.price - item.discountPrice) / item.price) * 100)}%
                        </span>
                    )}
                </div>
            )}

            {/* Delete */}
            {!outOfStock && <div className={`${styles.removeCell} flex-shrink-0`}>
                <button
                    onClick={handleRemove}
                    className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10
                               rounded-lg transition-all duration-200"
                    aria-label="Remove item"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>}
        </div>
    );
}
