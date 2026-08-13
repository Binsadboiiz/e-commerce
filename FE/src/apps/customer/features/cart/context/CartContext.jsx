import { createContext, useState, useCallback, useEffect } from "react";
import cartApi from "../api/cartApi";
import { useAuth } from "@/shared/features/auth/hooks/useAuth";
import { notify } from "@/shared/utils/Notify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set()); // Set of cartItemIds
    const { user, loading: authLoading, isAuthenticated } = useAuth();

    // ── Fetch cart from server ──
    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const data = await cartApi.getCart();
            setCart(data?.data);
        } catch (err) {
            if(err.response?.status === 401 || err.response?.status === 403) {
                setCart(null);
                return;
            }
            notify.error("Failed to fetch cart");
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Auto-fetch when user is available
    useEffect(() => {
        if(authLoading) return;

        if(!isAuthenticated) {
            setCart(null);
            return;
        }
        fetchCart();
    }, [authLoading, isAuthenticated, fetchCart]);

    useEffect(() => {
        if (!cart?.shopGroups) {
            setSelectedItems(new Set());
            return;
        }

        const validIds = new Set(cart.shopGroups.flatMap(group => group.items.map(item => item.cartItemId)));

        // Keep selection state in sync after checkout/removal refreshes the cart.
        setSelectedItems(prev => {
            const next = new Set([...prev].filter(id => validIds.has(id)));
            return next.size === prev.size ? prev : next;
        });
    }, [cart]);

    // ── Add to cart ──
    const addToCart = async (productId, quantity = 1, variantId = null) => {
        try {
            const data = await cartApi.add(productId, quantity, variantId);
            setCart(data?.data);
            return data?.data;
        } catch (err) {
            console.error("Failed to add to cart:", err);
            throw err;
        }
    };

    // ── Update quantity ──
    const updateQuantity = async (productId, quantity, variantId = null) => {
        try {
            const data = await cartApi.update(productId, quantity, variantId);
            setCart(data?.data);
            return data?.data;
        } catch (err) {
            console.error("Failed to update quantity:", err);
            throw err;
        }
    };

    // ── Remove item ──
    const removeItem = async (productId, variantId = null) => {
        try {
            await cartApi.remove(productId, variantId);
            await fetchCart();
        } catch (err) {
            console.error("Failed to remove item:", err);
            throw err;
        }
    };

    // ── Clear cart ──
    const clearCart = async () => {
        try {
            await cartApi.clear();
            setCart(null);
            setSelectedItems(new Set());
        } catch (err) {
            console.error("Failed to clear cart:", err);
            throw err;
        }
    };

    // ── Selection logic ──
    const toggleSelectItem = (cartItemId) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(cartItemId)) {
                next.delete(cartItemId);
            } else {
                next.add(cartItemId);
            }
            return next;
        });
    };

    const toggleSelectShop = (shopId) => {
        if (!cart) return;

        const shopGroup = cart.shopGroups?.find(g => g.shopId === shopId);
        if (!shopGroup) return;

        const shopItemIds = shopGroup.items.map(i => i.cartItemId);
        const allSelected = shopItemIds.every(id => selectedItems.has(id));

        setSelectedItems(prev => {
            const next = new Set(prev);
            shopItemIds.forEach(id => {
                if (allSelected) next.delete(id);
                else next.add(id);
            });
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (!cart) return;

        const allIds = cart.shopGroups?.flatMap(g => g.items.map(i => i.cartItemId)) || [];
        const allSelected = allIds.length > 0 && allIds.every(id => selectedItems.has(id));

        if (allSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(allIds));
        }
    };

    const isItemSelected = (cartItemId) => selectedItems.has(cartItemId);

    const isShopAllSelected = (shopId) => {
        if (!cart) return false;
        const shopGroup = cart.shopGroups?.find(g => g.shopId === shopId);
        if (!shopGroup || shopGroup.items.length === 0) return false;
        return shopGroup.items.every(i => selectedItems.has(i.cartItemId));
    };

    const isAllSelected = () => {
        if (!cart) return false;
        const allIds = cart.shopGroups?.flatMap(g => g.items.map(i => i.cartItemId)) || [];
        return allIds.length > 0 && allIds.every(id => selectedItems.has(id));
    };

    // ── Computed values ──
    const cartCount = cart?.totalItems || 0;

    const selectedTotal = () => {
        if (!cart) return 0;
        return cart.shopGroups
            ?.flatMap(g => g.items)
            .filter(i => selectedItems.has(i.cartItemId))
            .reduce((sum, i) => sum + i.subTotal, 0) || 0;
    };

    const selectedCount = selectedItems.size;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            cartCount,
            selectedItems,
            selectedCount,
            setCart,
            selectedTotal,
            fetchCart,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            toggleSelectItem,
            toggleSelectShop,
            toggleSelectAll,
            isItemSelected,
            isShopAllSelected,
            isAllSelected,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
