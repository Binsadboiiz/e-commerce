import { FiTrash2 } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';

export default function CartFooter() {
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
        <div className="sticky bottom-0 z-10 bg-bg-card border-t border-border
                        shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                {/* Left: Select All & Delete */}
                <div className="flex items-center gap-4">
                    {/* Select All Checkbox */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                className="peer sr-only"
                            />
                            <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded
                                            peer-checked:bg-primary peer-checked:border-primary
                                            transition-all duration-150 flex items-center justify-center">
                                {allSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm text-text-primary">
                            Chọn Tất Cả ({totalItems})
                        </span>
                    </label>

                    {/* Delete selected */}
                    {selectedCount > 0 && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-1.5 text-sm text-text-secondary
                                       hover:text-danger transition-colors"
                        >
                            <FiTrash2 size={14} />
                            Xóa
                        </button>
                    )}
                </div>

                {/* Right: Total & Checkout */}
                <div className="flex items-center gap-6">
                    {/* Total Price */}
                    <div className="text-right">
                        <div className="text-sm text-text-secondary">
                            Tổng thanh toán ({selectedCount} Sản phẩm):
                        </div>
                        <div className="text-xl font-bold text-text-price">
                            ₫{total.toLocaleString()}
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        disabled={selectedCount === 0}
                        className="px-10 py-3 bg-primary hover:bg-primary-dark text-white
                                   font-semibold rounded-lg shadow-card hover:shadow-hover
                                   transition-all duration-200
                                   transform hover:-translate-y-0.5 active:translate-y-0
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   disabled:hover:translate-y-0 disabled:hover:shadow-card
                                   text-sm uppercase tracking-wide"
                    >
                        Mua Hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
