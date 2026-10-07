import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronRight, FiMapPin, FiShoppingBag, FiTag } from "react-icons/fi";
import checkoutApi from "../api/checkoutApi";
import { useCart } from "../../cart/hooks/useCart";
import { ROUTES } from "@/config/route.config";
import Button from "@/shared/components/ui/Button";
import SEOHead from "@/shared/components/SEOHead";
import "./CheckoutPage.css";
import { notify } from "@/shared/utils/Notify";

const currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, selectedItems, fetchCart } = useCart();

    const [addresses, setAddresses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    const [voucherCodes, setVoucherCodes] = useState([]);
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [vouchersLoading, setVouchersLoading] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [manualVoucherCode, setManualVoucherCode] = useState("");

    const checkoutMode = location.state?.mode === "buy-now" ? "buy-now" : "cart";
    const buyNowState = location.state?.buyNow ?? null;

    const selectedCartItems = useMemo(() => {
        const cartItems = cart?.shopGroups?.flatMap(group => group.items) ?? [];
        return cartItems.filter(item => selectedItems.has(item.cartItemId));
    }, [cart, selectedItems]);

    const cartItemIds = useMemo(
        () => selectedCartItems.map(item => item.cartItemId),
        [selectedCartItems]
    );

    useEffect(() => {
        let ignore = false;

        async function bootstrapCheckout() {
            setLoading(true);
            setError("");

            try {
                const [addressData, paymentData] = await Promise.all([
                    checkoutApi.getAddresses(),
                    checkoutApi.getPaymentMethods()
                ]);

                if (ignore) {
                    return;
                }

                const addressList = addressData?.data || [];
                setAddresses(addressList);
                setPaymentMethods(paymentData?.data || []);

                const defaultAddress = addressList.find(address => address.isDefault) ?? addressList[0] ?? null;
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Unable to load checkout information.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        bootstrapCheckout();
        return () => {
            ignore = true;
        };
    }, []);

    // Tải danh sách voucher khả dụng
    useEffect(() => {
        if (loading) {
            return;
        }

        if (checkoutMode === "cart" && cartItemIds.length === 0) {
            return;
        }

        let ignore = false;

        async function loadVouchers() {
            setVouchersLoading(true);
            const payload = checkoutMode === "buy-now"
                ? {
                    buyNowProductId: buyNowState?.productId,
                    buyNowVariantId: buyNowState?.variantId,
                    buyNowQuantity: buyNowState?.quantity
                }
                : {
                    cartItemIds
                };

            try {
                const response = await checkoutApi.getApplicableVouchers(payload);
                if (!ignore) {
                    setAvailableVouchers(response?.data || []);
                }
            } catch (err) {
                console.error("Failed to load vouchers", err);
            } finally {
                if (!ignore) {
                    setVouchersLoading(false);
                }
            }
        }

        loadVouchers();

        return () => {
            ignore = true;
        };
    }, [loading, checkoutMode, buyNowState, cartItemIds]);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (checkoutMode === "cart" && cartItemIds.length === 0) {
            setError("Please select at least one cart item before checkout.");
            setPreview(null);
            return;
        }

        if (checkoutMode === "buy-now" && !buyNowState?.productId) {
            setError("Buy now details were not found.");
            setPreview(null);
            return;
        }

        let ignore = false;

        async function loadPreview() {
            setPreviewLoading(true);
            setError("");

            const payload = checkoutMode === "buy-now"
                ? {
                    ...buyNowState,
                    addressId: selectedAddressId,
                    paymentMethod: selectedPaymentMethod,
                    voucherCodes
                }
                : {
                    addressId: selectedAddressId,
                    paymentMethod: selectedPaymentMethod,
                    cartItemIds,
                    voucherCodes
                };

            try {
                const response = checkoutMode === "buy-now"
                    ? await checkoutApi.previewBuyNow(payload)
                    : await checkoutApi.previewCart(payload);

                if (!ignore) {
                    setPreview(response?.data ?? null);
                }
            } catch (err) {
                if (!ignore) {
                    setPreview(null);
                    setError(err.message || "Unable to load order preview.");
                }
            } finally {
                if (!ignore) {
                    setPreviewLoading(false);
                }
            }
        }

        loadPreview();

        return () => {
            ignore = true;
        };
    }, [loading, checkoutMode, buyNowState, cartItemIds, selectedAddressId, selectedPaymentMethod, voucherCodes]);

    async function handlePlaceOrder() {
        if (!preview || !selectedAddressId) {
            return;
        }

        setPlacingOrder(true);
        setError("");

        try {
            const payload = checkoutMode === "buy-now"
                ? {
                    ...buyNowState,
                    addressId: selectedAddressId,
                    paymentMethod: selectedPaymentMethod,
                    voucherCodes
                }
                : {
                    addressId: selectedAddressId,
                    paymentMethod: selectedPaymentMethod,
                    cartItemIds,
                    voucherCodes
                };

            const response = checkoutMode === "buy-now"
                ? await checkoutApi.placeBuyNowOrder(payload)
                : await checkoutApi.placeCartOrder(payload);
            const orderResult = response?.data;

            if (checkoutMode === "cart") {
                await fetchCart();
            }

            // window.alert(`Order placed successfully. Order ID: ${orderResult?.orderId}`);
            notify.success("Order placed successfully!")
            navigate(ROUTES.ORDER_TRACKING.replace(":orderId", String(orderResult?.orderId)));
        } catch (err) {
            setError(err.message || "Failed to place order.");
        } finally {
            setPlacingOrder(false);
        }
    }

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="checkout-shell checkout-loading">
                    <div className="checkout-skeleton checkout-skeleton-lg" />
                    <div className="checkout-skeleton checkout-skeleton-md" />
                    <div className="checkout-skeleton checkout-skeleton-sm" />
                </div>
            </div>
        );
    }

    const selectedAddress = addresses.find(address => address.id === selectedAddressId) ?? null;

    return (
        <div className="checkout-page">
            <SEOHead 
                title="Thanh Toán Đơn Hàng" 
                description="Hoàn tất thông tin thanh toán, địa chỉ nhận hàng và áp dụng mã giảm giá ưu đãi."
            />
            <div className="checkout-shell">
                <div className="checkout-breadcrumb">
                    <button onClick={() => navigate(-1)} className="checkout-back-button">Back</button>
                    <FiChevronRight />
                    <span className="checkout-current-page">Checkout</span>
                </div>

                {error && (
                    <div className="checkout-alert">
                        {error}
                    </div>
                )}

                <section className="checkout-card">
                    <div className="checkout-address-layout">
                        <div className="checkout-section-header">
                            <div className="checkout-icon-badge">
                                <FiMapPin size={18} />
                            </div>
                            <div>
                                <h2 className="checkout-section-title">Shipping Address</h2>
                                {selectedAddress ? (
                                    <div className="checkout-address-content">
                                        <p className="checkout-address-name">
                                            {selectedAddress.fullName} - {selectedAddress.phoneNumber}
                                        </p>
                                        <p className="checkout-address-text">
                                            {selectedAddress.houseNo}, {selectedAddress.streetName}, {selectedAddress.city}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="checkout-empty-text">
                                        No address found. Please add one in the database or the address management API.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="checkout-address-actions">
                            <select
                                value={selectedAddressId ?? ""}
                                onChange={(event) => setSelectedAddressId(Number(event.target.value))}
                                className="checkout-select"
                            >
                                <option value="" disabled>Select address</option>
                                {addresses.map(address => (
                                    <option key={address.id} value={address.id}>
                                        {address.fullName} - {address.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="checkout-card">
                    <div className="checkout-block-heading">
                        <div className="checkout-icon-badge checkout-icon-badge-dark">
                            <FiShoppingBag size={18} />
                        </div>
                        <h2 className="checkout-section-title">Ordered Products</h2>
                    </div>

                    <div className="checkout-table-head">
                        <span>Product</span>
                        <span className="checkout-table-center">Unit Price</span>
                        <span className="checkout-table-center">Quantity</span>
                        <span className="checkout-table-right">Subtotal</span>
                    </div>

                    <div className="checkout-items">
                        {(preview?.items ?? []).map(item => (
                            <div
                                key={`${item.productId}-${item.variantId ?? "base"}`}
                                className="checkout-item-row"
                            >
                                <div className="checkout-product-main">
                                    <div className="checkout-product-image">
                                        {item.productImage ? (
                                            <img src={item.productImage} alt={item.productName} className="checkout-product-image-tag" />
                                        ) : (
                                            <div className="checkout-no-image">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className="checkout-product-copy">
                                        <p className="checkout-product-name">{item.productName}</p>
                                        <p className="checkout-product-variant">
                                            {item.variantName && item.variantValue
                                                ? `${item.variantName}: ${item.variantValue}`
                                                : "No variant"}
                                        </p>
                                    </div>
                                </div>
                                <div className="checkout-price-cell">
                                    {currency.format(item.unitPrice)}
                                </div>
                                <div className="checkout-quantity-cell">{item.quantity}</div>
                                <div className="checkout-subtotal-cell">
                                    {currency.format(item.lineTotal)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!previewLoading && (preview?.items?.length ?? 0) === 0 && (
                        <div className="checkout-empty-state">
                            No items are currently available for checkout.
                        </div>
                    )}
                </section>

                <section className="checkout-card">
                    <div className="checkout-block-heading">
                        <div className="checkout-icon-badge checkout-icon-badge-dark">
                            <FiTag size={18} />
                        </div>
                        <h2 className="checkout-section-title">Vouchers</h2>
                    </div>

                    <div className="checkout-vouchers-widget">
                        {voucherCodes.length > 0 ? (
                            <div className="applied-vouchers-list">
                                {voucherCodes.map(code => {
                                    const vDetails = availableVouchers.find(v => v.code === code);
                                    let descriptionText = "Discount applied";
                                    if (vDetails) {
                                        descriptionText = vDetails.voucherType === "Shipping" ? "Free Shipping" : "";
                                        if (vDetails.discountType === "percent") {
                                            descriptionText += ` ${vDetails.value}% Off`;
                                        } else {
                                            descriptionText += ` ${currency.format(vDetails.value)} Off`;
                                        }
                                        if (vDetails.shopName) {
                                            descriptionText += ` (${vDetails.shopName})`;
                                        }
                                    }
                                    return (
                                        <div key={code} className="applied-voucher-badge">
                                            <span className="applied-voucher-code">{code}</span>
                                            <span className="applied-voucher-desc">{descriptionText}</span>
                                            <button
                                                type="button"
                                                onClick={() => setVoucherCodes(prev => prev.filter(c => c !== code))}
                                                className="remove-voucher-btn"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-vouchers-applied-text">No vouchers applied to this order yet.</p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowVoucherModal(true)}
                            className="select-vouchers-trigger-btn"
                        >
                            Select or Enter Voucher Code
                        </button>
                    </div>
                </section>

                <section className="checkout-card">
                    <div className="checkout-bottom-grid">
                        <div className="checkout-payment-panel">
                            <h2 className="checkout-section-title">Payment Method</h2>
                            <div className="checkout-method-grid">
                                {paymentMethods.map(method => {
                                    const isActive = selectedPaymentMethod === method.code;
                                    const isDisabled = !method.isEnabled;

                                    return (
                                        <button
                                            key={method.code}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => setSelectedPaymentMethod(method.code)}
                                            className={[
                                                "checkout-method-button",
                                                isActive ? "checkout-method-button-active" : "",
                                                isDisabled ? "checkout-method-button-disabled" : ""
                                            ].join(" ").trim()}
                                        >
                                            {method.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="checkout-payment-note">
                                Only COD is enabled right now. Other payment methods remain visible for future expansion.
                            </p>
                        </div>

                        <div className="checkout-summary-panel">
                            <div className="checkout-summary-rows">
                                <SummaryRow label="Merchandise Subtotal" value={preview?.merchandiseSubtotal} />
                                <SummaryRow label="Shipping Fee" value={preview?.shippingFee} />
                                <SummaryRow label="Discount" value={-(preview?.discountAmount ?? 0)} highlight="checkout-success-text" />
                                <div className="checkout-summary-total">
                                    <SummaryRow
                                        label="Total Payment"
                                        value={preview?.finalAmount}
                                        emphasis
                                        highlight="checkout-total-text"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={handlePlaceOrder}
                                isLoading={placingOrder}
                                disabled={!preview || previewLoading || !selectedAddress} replace
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            {showVoucherModal && (
                <div className="voucher-modal-backdrop" onClick={() => setShowVoucherModal(false)}>
                    <div className="voucher-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="voucher-modal-header">
                            <h3>Select Voucher</h3>
                            <button className="voucher-modal-close-btn" onClick={() => setShowVoucherModal(false)}>×</button>
                        </div>
                        
                        <div className="voucher-manual-apply-box">
                            <input
                                type="text"
                                placeholder="Enter voucher code (e.g. HOT2026)"
                                value={manualVoucherCode}
                                onChange={(e) => setManualVoucherCode(e.target.value)}
                                className="voucher-manual-input"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (!manualVoucherCode.trim()) return;
                                    const code = manualVoucherCode.trim().toUpperCase();
                                    if (voucherCodes.includes(code)) {
                                        window.alert("This voucher code is already applied.");
                                        return;
                                    }
                                    setVoucherCodes(prev => [...prev, code]);
                                    setManualVoucherCode("");
                                    setShowVoucherModal(false);
                                }}
                                className="voucher-manual-apply-btn"
                            >
                                Apply
                            </button>
                        </div>

                        {vouchersLoading ? (
                            <div className="voucher-modal-loading">Loading vouchers...</div>
                        ) : availableVouchers.length === 0 ? (
                            <div className="voucher-modal-empty">No applicable vouchers found for this order.</div>
                        ) : (
                            <div className="voucher-modal-list">
                                {availableVouchers.map(voucher => {
                                    const isApplied = voucherCodes.includes(voucher.code);
                                    let discountText = voucher.discountType === "percent" ? `${voucher.value}%` : currency.format(voucher.value);
                                    let typeLabel = "Product Discount";
                                    if (voucher.voucherType === "Shipping") {
                                        typeLabel = "Shipping";
                                    } else if (voucher.voucherType === "Category") {
                                        typeLabel = `Category: ${voucher.categoryName}`;
                                    }

                                    return (
                                        <div key={voucher.id} className={`voucher-option-card ${!voucher.isApplicable ? "disabled" : ""} ${isApplied ? "applied" : ""}`}>
                                            <div className={`voucher-option-left ${voucher.voucherType.toLowerCase()}`}>
                                                <span className="voucher-option-discount-type">{typeLabel}</span>
                                                <span className="voucher-option-discount-value">{discountText}</span>
                                            </div>
                                            <div className="voucher-option-right">
                                                <div className="voucher-option-top-row">
                                                    <span className="voucher-option-code">{voucher.code}</span>
                                                    {voucher.shopName && (
                                                        <span className="voucher-option-shop-tag">
                                                            Shop: {voucher.shopName}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="voucher-option-condition">
                                                    Min spend {voucher.minOrderValue ? currency.format(voucher.minOrderValue) : "0đ"}.
                                                    {voucher.maxDiscount && ` Max discount ${currency.format(voucher.maxDiscount)}.`}
                                                </p>
                                                {voucher.expiredAt && (
                                                    <p className="voucher-option-expired">
                                                        Expiry: {new Date(voucher.expiredAt).toLocaleDateString("en-US")}
                                                    </p>
                                                )}
                                                
                                                {!voucher.isApplicable ? (
                                                    <p className="voucher-option-reason-error">{voucher.reason}</p>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isApplied) {
                                                                setVoucherCodes(prev => prev.filter(c => c !== voucher.code));
                                                            } else {
                                                                setVoucherCodes(prev => [...prev, voucher.code]);
                                                            }
                                                            setShowVoucherModal(false);
                                                        }}
                                                        className={`voucher-option-apply-btn ${isApplied ? "applied" : ""}`}
                                                    >
                                                        {isApplied ? "Remove" : "Apply"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryRow({ label, value = 0, emphasis = false, highlight = "" }) {
    return (
        <div className="checkout-summary-row">
            <span className={emphasis ? "checkout-summary-label checkout-summary-label-strong" : "checkout-summary-label"}>{label}</span>
            <span className={`${emphasis ? "checkout-summary-value checkout-summary-value-strong" : "checkout-summary-value"} ${highlight}`}>
                {currency.format(value)}
            </span>
        </div>
    );
}
