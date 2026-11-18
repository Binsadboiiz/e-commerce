import { useState, useEffect } from "react";
import { Package, CreditCard, User, DollarSign, RefreshCw } from "lucide-react";
import { sellerOrderApi } from "../api/sellerOrderApi";
import { notify } from "@/shared/utils/Notify";
import { SellerOrderDetailSkeleton } from "./SellerOrdersSkeleton";
import {
    SellerModal,
    SellerButton,
    SellerBadge
} from "@/apps/seller/components/common";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

const STATUS_BADGE_MAP = {
    pending: "warning",
    confirmed: "info",
    preparing: "info",
    shipped: "primary",
    in_transit: "primary",
    out_for_delivery: "primary",
    delivered: "success",
    delivery_failed: "danger",
    cancelled: "danger"
};

export default function SellerOrderDetailModal({ orderId, isOpen, onClose, onOpenUpdateStatus }) {
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchDetail();
        } else {
            setOrderDetail(null);
        }
    }, [isOpen, orderId]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await sellerOrderApi.getOrderDetail(orderId);
            setOrderDetail(res?.data || null);
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Failed to load order details";
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <SellerModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Order Details #${orderId}`}
            subtitle={
                orderDetail?.createdAt
                    ? `Created on ${new Date(orderDetail.createdAt).toLocaleString("vi-VN")}`
                    : undefined
            }
            size="lg"
            footer={
                <>
                    <SellerButton variant="outline" onClick={onClose}>
                        Close
                    </SellerButton>
                    {orderDetail && (
                        <SellerButton
                            variant="primary"
                            icon={RefreshCw}
                            onClick={() => {
                                onClose();
                                onOpenUpdateStatus(orderDetail);
                            }}
                        >
                            Update Order Status
                        </SellerButton>
                    )}
                </>
            }
        >
            {loading ? (
                <SellerOrderDetailSkeleton />
            ) : !orderDetail ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--seller-text-subtle, #64748b)" }}>
                    <Package size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                    <p>Order information unavailable.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Summary Cards */}
                    <div className="order-summary-grid">
                        <div className="summary-card">
                            <div className="card-icon customer-icon">
                                <User size={18} />
                            </div>
                            <div className="card-info">
                                <span className="card-label">Customer</span>
                                <span className="card-value">{orderDetail.customerName || "N/A"}</span>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="card-icon payment-icon">
                                <CreditCard size={18} />
                            </div>
                            <div className="card-info">
                                <span className="card-label">Payment</span>
                                <span className="card-value">
                                    {orderDetail.paymentMethod || "COD"}
                                    <SellerBadge
                                        variant={orderDetail.paymentStatus?.toLowerCase() === "paid" ? "success" : "neutral"}
                                        size="sm"
                                        style={{ marginLeft: "6px" }}
                                    >
                                        {orderDetail.paymentStatus || "Unpaid"}
                                    </SellerBadge>
                                </span>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="card-icon total-icon">
                                <DollarSign size={18} />
                            </div>
                            <div className="card-info">
                                <span className="card-label">Shop Revenue</span>
                                <span className="card-value highlight">
                                    {currencyFormatter.format(orderDetail.sellerTotal || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Items table */}
                    <div className="items-section">
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "600", color: "var(--seller-text-main, #1e293b)" }}>
                            Order Items ({orderDetail.items?.length || 0})
                        </h4>
                        <div className="seller-table-container">
                            <table className="seller-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Qty</th>
                                        <th>Subtotal</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetail.items?.map((item) => {
                                        const badgeVariant = STATUS_BADGE_MAP[item.status?.toLowerCase()] || "neutral";
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="item-product-cell">
                                                        {item.productImage ? (
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className="item-thumbnail"
                                                            />
                                                        ) : (
                                                            <div className="item-thumbnail-placeholder">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                        <div className="item-details">
                                                            <span className="item-name">{item.productName}</span>
                                                            {(item.variantName || item.variantValue) && (
                                                                <span className="item-variant">
                                                                    {item.variantName}: {item.variantValue}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{currencyFormatter.format(item.price)}</td>
                                                <td>x{item.quantity}</td>
                                                <td style={{ fontWeight: 600, color: "var(--seller-text-main, #0f172a)" }}>
                                                    {currencyFormatter.format(item.subtotal || item.price * item.quantity)}
                                                </td>
                                                <td>
                                                    <SellerBadge variant={badgeVariant} dot size="sm">
                                                        {item.status}
                                                    </SellerBadge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </SellerModal>
    );
}
