import { useState, useEffect } from "react";
import { MapPin, FileText } from "lucide-react";
import { sellerOrderApi } from "../api/sellerOrderApi";
import { notify } from "@/shared/utils/Notify";
import {
    SellerModal,
    SellerButton,
    SellerFormField,
    SellerSelect,
    SellerInput,
    SellerTextarea,
    SellerBadge
} from "@/apps/seller/components/common";

const STATUS_TRANSITIONS = {
    pending: [
        { value: "confirmed", label: "Confirm Order (Confirmed)" },
        { value: "cancelled", label: "Cancel Order (Cancelled)" }
    ],
    confirmed: [
        { value: "preparing", label: "Prepare Order (Preparing)" },
        { value: "cancelled", label: "Cancel Order (Cancelled)" }
    ],
    preparing: [
        { value: "shipped", label: "Ship Order (Shipped)" }
    ],
    shipped: [
        { value: "in_transit", label: "In Transit" }
    ],
    in_transit: [
        { value: "out_for_delivery", label: "Out for Delivery" }
    ],
    out_for_delivery: [
        { value: "delivered", label: "Delivered Successfully" },
        { value: "delivery_failed", label: "Delivery Failed" }
    ],
    delivery_failed: [
        { value: "out_for_delivery", label: "Retry Delivery (Out for Delivery)" }
    ]
};

const ALL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "shipped", label: "Shipped" },
    { value: "in_transit", label: "In Transit" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "delivery_failed", label: "Delivery Failed" },
    { value: "cancelled", label: "Cancelled" }
];

export default function UpdateOrderStatusModal({ order, isOpen, onClose, onSuccess }) {
    const currentStatus = (order?.status || "pending").toLowerCase();
    const allowedOptions = STATUS_TRANSITIONS[currentStatus] || [];

    const [status, setStatus] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            if (allowedOptions.length > 0) {
                setStatus(allowedOptions[0].value);
            } else {
                setStatus(currentStatus);
            }
            setLocation("");
            setDescription("");
        }
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    const isTerminal = currentStatus === "delivered" || currentStatus === "cancelled";

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!status) {
            notify.error("Please select a target status.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                status,
                location: location.trim() || undefined,
                description: description.trim() || undefined
            };

            await sellerOrderApi.updateOrderStatus(order.orderId, payload);
            notify.success("Order status updated successfully!");
            onSuccess();
            onClose();
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Failed to update order status";
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SellerModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Update Order Status #${order.orderId}`}
            subtitle={
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                    Current Status: <SellerBadge variant={currentStatus === "delivered" ? "success" : currentStatus === "cancelled" ? "danger" : "warning"} dot>{currentStatus}</SellerBadge>
                </span>
            }
            size="md"
            footer={
                <>
                    <SellerButton variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </SellerButton>
                    {!isTerminal && (
                        <SellerButton variant="primary" onClick={handleSubmit} loading={loading}>
                            Confirm Update
                        </SellerButton>
                    )}
                </>
            }
        >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {isTerminal ? (
                    <div style={{
                        padding: "16px",
                        borderRadius: "8px",
                        background: "var(--seller-bg, #f8fafc)",
                        border: "1px solid var(--seller-border, #e2e8f0)",
                        color: "var(--seller-text-muted, #64748b)",
                        fontSize: "14px"
                    }}>
                        This order is in a final state (<strong>{currentStatus}</strong>) and cannot be updated further.
                    </div>
                ) : (
                    <>
                        <SellerFormField
                            label="Next Status"
                            required
                            helper="Only valid workflow transitions are displayed."
                        >
                            <SellerSelect
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                {allowedOptions.length > 0 ? (
                                    allowedOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))
                                ) : (
                                    ALL_STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))
                                )}
                            </SellerSelect>
                        </SellerFormField>

                        <SellerFormField label="Location (Optional)">
                            <SellerInput
                                placeholder="e.g. Warehouse Hanoi, Sorting Facility"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </SellerFormField>

                        <SellerFormField label="Note / Description (Optional)">
                            <SellerTextarea
                                rows={3}
                                placeholder="e.g. Package packed and handed over to courier"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </SellerFormField>
                    </>
                )}
            </form>
        </SellerModal>
    );
}
