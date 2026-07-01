import { useCart } from '../hooks/useCart';
import CartShopGroup from "../components/CartShopGroup";
import CartFooter from "../components/CartFooter";
import EmptyCart from "../components/EmptyCart";
import { FiShoppingCart } from 'react-icons/fi';

export default function CartPage() {
    const { cart, loading } = useCart();

    const hasItems = cart?.shopGroups?.length > 0;

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <CartSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-page">
            {/* Page Header */}
            <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
                <div className="flex items-center gap-3 mb-6">
                    <FiShoppingCart className="text-primary" size={24} />
                    <h1 className="text-2xl font-bold text-text-primary">Shopping Cart</h1>
                    {hasItems && (
                        <span className="text-sm text-text-secondary ml-1">
                            ({cart.totalItems} products)
                        </span>
                    )}
                </div>

                {hasItems ? (
                    <>
                        {/* Table Header */}
                        <div className="bg-bg-card rounded-lg shadow-card px-5 py-3 mb-3
                                        border border-border/50 hidden md:flex items-center gap-4">
                            <div className="w-[18px] flex-shrink-0"></div>
                            <div className="w-20 flex-shrink-0"></div>
                            <div className="flex-1 text-sm text-text-secondary font-medium">Product</div>
                            <div className="w-28 text-center text-sm text-text-secondary font-medium flex-shrink-0">Unit Price</div>
                            <div className="w-[88px] text-center text-sm text-text-secondary font-medium flex-shrink-0">Quantity</div>
                            <div className="w-28 text-right text-sm text-text-secondary font-medium flex-shrink-0">Total</div>
                            <div className="w-10 flex-shrink-0"></div>
                        </div>

                        {/* Shop Groups */}
                        <div className="pb-24">
                            {cart.shopGroups.map(shopGroup => (
                                <CartShopGroup key={shopGroup.shopId} shopGroup={shopGroup} />
                            ))}
                        </div>

                        {/* Footer */}
                        <CartFooter />
                    </>
                ) : (
                    <EmptyCart />
                )}
            </div>
        </div>
    );
}

// ── Loading Skeleton ──
function CartSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-gray-200 rounded" />
                <div className="w-32 h-7 bg-gray-200 rounded" />
            </div>

            {/* Table header */}
            <div className="h-12 bg-gray-200 rounded-lg" />

            {/* Shop groups */}
            {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
                    <div className="h-12 bg-gray-100 border-b border-gray-100" />
                    {[1, 2].map(j => (
                        <div key={j} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
                            <div className="w-[18px] h-[18px] bg-gray-200 rounded" />
                            <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                                <div className="w-1/4 h-3 bg-gray-200 rounded" />
                            </div>
                            <div className="w-16 h-4 bg-gray-200 rounded" />
                            <div className="w-20 h-8 bg-gray-200 rounded" />
                            <div className="w-16 h-4 bg-gray-200 rounded" />
                            <div className="w-8 h-8 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
