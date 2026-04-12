import { FiShoppingBag } from 'react-icons/fi';
import CartItemRow from './CartItem';
import { useCart } from '../hooks/useCart';

export default function CartShopGroup({ shopGroup }) {
    const { toggleSelectShop, isShopAllSelected } = useCart();
    const allSelected = isShopAllSelected(shopGroup.shopId);

    return (
        <div className="bg-bg-card rounded-lg shadow-card overflow-hidden animate-fade-in
                        mb-3 border border-border/50">
            {/* Shop Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-gray-50/50">
                {/* Shop Checkbox */}
                <label className="relative flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleSelectShop(shopGroup.shopId)}
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
