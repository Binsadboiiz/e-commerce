import { useState, useEffect } from "react";
import { X, Package, CreditCard, User, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { sellerOrderApi } from "../api/sellerOrderApi";
import { notify } from "@/shared/utils/Notify";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

const STATUS_LABELS = {
    pending: { label: "Pending Confirmation", colorClass: "status-pending" },
    confirmed: { label: "Confirmed", colorClass: "status-confirmed" },
    preparing: { label: "Preparing Order", colorClass: "status-preparing" },
    shipped: { label: "Shipped", colorClass: "status-shipped" },
    in_transit: { label: "In Transit", colorClass: "status-in-transit" },
    out_for_delivery: { label: "Out for Delivery", colorClass: "status-out-delivery" },
    delivery_failed: { label: "Delivery Failed", colorClass: "status-failed" },
    delivered: { label: "Delivered", colorClass: "status-delivered" },
    cancelled: { label: "Cancelled", colorClass: "status-cancelled" },
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
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content-card order-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>Order Details #{orderId}</h2>
                        {orderDetail?.createdAt && (
                            <p className="order-modal-sub">
                                Created on {new Date(orderDetail.createdAt).toLocaleString("vi-VN")}
                            </p>
                        )}
                    </div>
                    <button className="close-modal-btn" onClick={onClose} title="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body-scroll">
                    {loading ? (
                        <div className="modal-loading">
                            <div className="spinner" />
                            <p>Loading order details...</p>
                        </div>
                    ) : !orderDetail ? (
                        <div className="modal-empty">
                            <Package size={40} className="empty-icon" />
                            <p>Order information unavailable.</p>
                        </div>
                    ) : (
                        <div className="order-detail-content">
                            {/* Summary info cards */}
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
                                            <span className={`payment-status-tag ${orderDetail.paymentStatus?.toLowerCase()}`}>
                                                {orderDetail.paymentStatus || "Unpaid"}
                                            </span>
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
                                <h3 className="section-title">Order Items ({orderDetail.items?.length || 0})</h3>
                                <div className="detail-table-wrapper">
                                    <table className="detail-table">
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
                                                const statusObj = STATUS_LABELS[item.status?.toLowerCase()] || {
                                                    label: item.status,
                                                    colorClass: "status-default"
                                                };
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
                                                        <td className="item-subtotal">
                                                            {currencyFormatter.format(item.subtotal || item.price * item.quantity)}
                                                        </td>
                                                        <td>
                                                            <span className={`order-status-badge ${statusObj.colorClass}`}>
                                                                {statusObj.label}
                                                            </span>
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
                </div>

                <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={onClose}>
                        Close
                    </button>
                    {orderDetail && (
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={() => {
                                onClose();
                                onOpenUpdateStatus(orderDetail);
                            }}
                        >
                            <RefreshCw size={16} />
                            <span>Update Order Status</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
