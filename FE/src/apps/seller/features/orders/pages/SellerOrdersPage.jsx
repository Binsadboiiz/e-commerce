import { useState, useEffect, useCallback } from "react";
import {
    ShoppingCart,
    Eye,
    RefreshCw,
    Clock,
    CheckCircle,
    Truck,
    PackageCheck,
    XCircle
} from "lucide-react";
import { sellerOrderApi } from "../api/sellerOrderApi";
import SellerOrderDetailModal from "../components/SellerOrderDetailModal";
import UpdateOrderStatusModal from "../components/UpdateOrderStatusModal";
import SEOHead from "@/shared/components/SEOHead";
import { SellerOrdersSkeleton } from "../components/SellerOrdersSkeleton";
import { notify } from "@/shared/utils/Notify";
import {
    SellerPageHeader,
    SellerBadge,
    SellerButton,
    SellerPagination,
    SellerEmptyState
} from "@/apps/seller/components/common";
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
    pending: { label: "Pending", variant: "warning" },
    confirmed: { label: "Confirmed", variant: "info" },
    preparing: { label: "Preparing", variant: "info" },
    shipped: { label: "Shipped", variant: "primary" },
    in_transit: { label: "In Transit", variant: "primary" },
    out_for_delivery: { label: "Out for Delivery", variant: "primary" },
    delivery_failed: { label: "Delivery Failed", variant: "danger" },
    delivered: { label: "Delivered", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger" }
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
        <div className="seller-page-container">
            <SEOHead 
                title="Quản Lý Đơn Hàng - Kênh Người Bán" 
                robots="noindex, nofollow" 
                description="Bảng quản lý và xử lý đơn hàng của shop từ khách hàng."
            />
            
            {/* Page Header */}
            <SellerPageHeader
                title="Order Management"
                subtitle="Track and process customer orders for your shop"
                count={total}
            />

            {/* Filter Tabs Card */}
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
            <div className="seller-card" style={{ padding: 0, overflow: "hidden" }}>
                {loading ? (
                    <SellerOrdersSkeleton />
                ) : orders.length === 0 ? (
                    <SellerEmptyState
                        icon={ShoppingCart}
                        title="No Orders Found"
                        description="There are currently no orders under the selected status filter."
                    />
                ) : (
                    <div className="seller-table-container" style={{ border: "none", borderRadius: 0 }}>
                        <table className="seller-table">
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
                                        variant: "neutral"
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
                                                    <SellerBadge
                                                        variant={order.paymentStatus?.toLowerCase() === "paid" ? "success" : "neutral"}
                                                        size="sm"
                                                    >
                                                        {order.paymentStatus || "Unpaid"}
                                                    </SellerBadge>
                                                </div>
                                            </td>
                                            <td>
                                                <SellerBadge variant={statusObj.variant} dot>
                                                    {statusObj.label}
                                                </SellerBadge>
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
                                            <td className="text-right">
                                                <div style={{ display: "inline-flex", gap: "6px" }}>
                                                    <SellerButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={Eye}
                                                        onClick={() => handleOpenDetail(order.orderId)}
                                                        title="View Details"
                                                    >
                                                        Details
                                                    </SellerButton>
                                                    <SellerButton
                                                        variant="outline"
                                                        size="sm"
                                                        icon={RefreshCw}
                                                        onClick={() => handleOpenUpdate(order)}
                                                        title="Update Status"
                                                    >
                                                        Update
                                                    </SellerButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Shared Pagination */}
                {totalPages > 1 && (
                    <SellerPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
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
