import { useState, useEffect, useCallback } from "react";
import {
    ShoppingCart,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    RefreshCw,
    Clock,
    CheckCircle,
    Truck,
    PackageCheck,
    XCircle,
    Filter
} from "lucide-react";
import { sellerOrderApi } from "../api/sellerOrderApi";
import SellerOrderDetailModal from "../components/SellerOrderDetailModal";
import UpdateOrderStatusModal from "../components/UpdateOrderStatusModal";
import { notify } from "@/shared/utils/Notify";
import SEOHead from "@/shared/components/SEOHead";
import "./SellerOrdersPage.css";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

const STATUS_TABS = [
    { value: "all", label: "All Orders", icon: ShoppingCart },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle },
    { value: "preparing", label: "Preparing", icon: RefreshCw },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: PackageCheck },
    { value: "cancelled", label: "Cancelled", icon: XCircle }
];

const STATUS_CONFIG = {
    pending: { label: "Pending", class: "status-pending" },
    confirmed: { label: "Confirmed", class: "status-confirmed" },
    preparing: { label: "Preparing", class: "status-preparing" },
    shipped: { label: "Shipped", class: "status-shipped" },
    in_transit: { label: "In Transit", class: "status-in-transit" },
    out_for_delivery: { label: "Out for Delivery", class: "status-out-delivery" },
    delivery_failed: { label: "Delivery Failed", class: "status-failed" },
    delivered: { label: "Delivered", class: "status-delivered" },
    cancelled: { label: "Cancelled", class: "status-cancelled" }
};

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal states
    const [detailOrderId, setDetailOrderId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await sellerOrderApi.getOrders({
                page,
                pageSize,
                status: statusFilter !== "all" ? statusFilter : undefined
            });
            const data = res?.data;
            setOrders(data?.items || []);
            setTotal(data?.total || 0);
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Failed to fetch orders";
            notify.error(message);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleTabChange = (val) => {
        setStatusFilter(val);
        setPage(1);
    };

    const handleOpenDetail = (orderId) => {
        setDetailOrderId(orderId);
        setIsDetailOpen(true);
    };

    const handleOpenUpdate = (order) => {
        setSelectedOrderForUpdate(order);
        setIsUpdateOpen(true);
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="seller-orders-container">
            <SEOHead 
                title="Quản Lý Đơn Hàng - Kênh Người Bán" 
                robots="noindex, nofollow" 
                description="Bảng quản lý và xử lý đơn hàng của shop từ khách hàng."
            />
            {/* Page Header */}
            <header className="orders-header">
                <div>
                    <h1 className="orders-title">Order Management</h1>
                    <p className="orders-subtitle">Track and process customer orders for your shop</p>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="orders-tabs-card">
                <div className="status-tabs-scroll">
                    {STATUS_TABS.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = statusFilter === tab.value;
                        return (
                            <button
                                key={tab.value}
                                className={`tab-btn ${isActive ? "active" : ""}`}
                                onClick={() => handleTabChange(tab.value)}
                            >
                                <IconComponent size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="orders-list-card">
                {loading ? (
                    <div className="orders-loading">
                        <div className="spinner" />
                        <p>Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="orders-empty">
                        <ShoppingCart size={48} className="empty-icon" />
                        <h3>No Orders Found</h3>
                        <p>There are currently no orders under the selected status filter.</p>
                    </div>
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Payment</th>
                                    <th>Order Status</th>
                                    <th>Created At</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const statusKey = order.status?.toLowerCase() || "pending";
                                    const statusObj = STATUS_CONFIG[statusKey] || {
                                        label: order.status,
                                        class: "status-default"
                                    };

                                    return (
                                        <tr key={order.orderId}>
                                            <td>
                                                <span className="order-id-badge">#{order.orderId}</span>
                                            </td>
                                            <td>
                                                <span className="customer-name-text">
                                                    {order.customerName || "Customer"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="items-count-badge">
                                                    {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="order-total-text">
                                                    {currencyFormatter.format(order.sellerTotal || 0)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="payment-cell">
                                                    <span className="pay-method">{order.paymentMethod || "COD"}</span>
                                                    <span className={`pay-status-pill ${order.paymentStatus?.toLowerCase()}`}>
                                                        {order.paymentStatus || "Unpaid"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`order-status-badge ${statusObj.class}`}>
                                                    {statusObj.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="created-at-text">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                                              day: "2-digit",
                                                              month: "2-digit",
                                                              year: "numeric",
                                                              hour: "2-digit",
                                                              minute: "2-digit"
                                                          })
                                                        : "N/A"}
                                                </span>
                                            </td>
                                            <td className="text-right actions-cell">
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => handleOpenDetail(order.orderId)}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                    <span>Details</span>
                                                </button>
                                                <button
                                                    className="action-btn update-btn"
                                                    onClick={() => handleOpenUpdate(order)}
                                                    title="Update Status"
                                                >
                                                    <RefreshCw size={16} />
                                                    <span>Update</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="orders-pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="pagination-arrow"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="pagination-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            className="pagination-arrow"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <SellerOrderDetailModal
                orderId={detailOrderId}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onOpenUpdateStatus={(orderDetail) => {
                    setSelectedOrderForUpdate(orderDetail);
                    setIsUpdateOpen(true);
                }}
            />

            {/* Update Status Modal */}
            <UpdateOrderStatusModal
                order={selectedOrderForUpdate}
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                onSuccess={fetchOrders}
            />
        </div>
    );
}
