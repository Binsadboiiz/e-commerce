import { FiShoppingBag } from 'react-icons/fi';
import CartItemRow from './CartItem';
import { useCart } from '../hooks/useCart';
import styles from '../pages/CartPage.module.css';

export default function CartShopGroup({ shopGroup }) {
    const { toggleSelectShop, isShopAllSelected } = useCart();
    const allSelected = isShopAllSelected(shopGroup.shopId);

    return (
        <div className={styles.shopCard}>
            {/* Shop Header */}
            <div className={styles.shopHeader}>
                {/* Shop Checkbox */}
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleSelectShop(shopGroup.shopId)}
                        className={styles.checkboxInput}
                    />
                    <div className={styles.checkboxCustom}>
                        {allSelected && (
                            <svg className={styles.checkboxCheckmark} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </label>

                {/* Shop Logo & Name */}
                <div className="flex items-center gap-2">
                    {shopGroup.shopLogo ? (
                        <img
                            src={shopGroup.shopLogo}
                            alt={shopGroup.shopName}
                            className="w-6 h-6 rounded-full object-cover border border-border"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <FiShoppingBag className="text-primary" size={12} />
                        </div>
                    )}
                    <span className="font-semibold text-sm text-text-primary">
                        {shopGroup.shopName}
                    </span>
                </div>
            </div>

            {/* Cart Items */}
            <div>
                {shopGroup.items.map(item => (
                    <CartItemRow key={item.cartItemId} item={item} />
                ))}
            </div>
        </div>
    );
}
