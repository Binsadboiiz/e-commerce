import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ROUTES } from '@/config/route.config';
import styles from '../pages/CartPage.module.css';
import formatPrice from '@/apps/customer/features/product/utils/formatPrice';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function CartFooter() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const {
        cart,
        selectedCount,
        selectedTotal,
        toggleSelectAll,
        isAllSelected,
        clearCart
    } = useCart();

    const allSelected = isAllSelected();
    const total = selectedTotal();
    const totalItems = cart?.totalItems || 0;

    return (
        <div className={styles.footerSticky}>
            {/* Left: Select All & Delete */}
            <div className="flex items-center gap-6">
                {/* Select All Checkbox */}
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className={styles.checkboxInput}
                    />
                    <div className={styles.checkboxCustom}>
                        {allSelected && (
                            <svg className={styles.checkboxCheckmark} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                        {t('cart.selectAll')} ({totalItems})
                    </span>
                </label>

                {/* Delete selected */}
                {selectedCount > 0 && (
                    <button
                        onClick={clearCart}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors"
                    >
                        <FiTrash2 size={15} />
                        <span>{t('cart.deleteAll')}</span>
                    </button>
                )}
            </div>

            {/* Right: Total & Checkout */}
            <div className="flex items-center gap-6">
                {/* Total Price */}
                <div className="text-right">
                    <span className="text-sm text-slate-500 mr-2">
                        {t('cart.totalAmount')} ({selectedCount}):
                    </span>
                    <span className="text-xl font-bold text-rose-600">
                        {formatPrice(total)}
                    </span>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={() => navigate(ROUTES.CHECKOUT, { state: { mode: 'cart' } })}
                    disabled={selectedCount === 0}
                    className={styles.buttonPrimary}
                >
                    {t('cart.checkout')}
                </button>
            </div>
        </div>
    );
}
