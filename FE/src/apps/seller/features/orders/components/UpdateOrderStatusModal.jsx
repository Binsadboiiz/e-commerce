import { useState, useEffect } from "react";
import { X, RefreshCw, MapPin, FileText } from "lucide-react";
import { sellerOrderApi } from "../api/sellerOrderApi";
import { notify } from "@/shared/utils/Notify";

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
            // Default to first valid transition option if available
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
        e.preventDefault();
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
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content-card update-status-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>Update Order Status #{order.orderId}</h2>
                        <p className="order-modal-sub">
                            Current Status: <span className="current-status-tag">{currentStatus}</span>
                        </p>
                    </div>
                    <button className="close-modal-btn" onClick={onClose} title="Close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="status-update-form">
                    <div className="form-grid single-col">
                        {isTerminal ? (
                            <div className="terminal-notice">
                                <p>This order is in a final state (<strong>{currentStatus}</strong>) and cannot be updated further.</p>
                            </div>
                        ) : (
                            <>
                                <div className="form-field">
                                    <label htmlFor="targetStatus">Next Status <span className="req">*</span></label>
                                    <select
                                        id="targetStatus"
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
                                    </select>
                                    <small className="help-text">
                                        Only valid workflow transitions are displayed above.
                                    </small>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="location">
                                        <MapPin size={14} className="field-icon" /> Location (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        placeholder="e.g. Warehouse Hanoi, Sorting Facility"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="description">
                                        <FileText size={14} className="field-icon" /> Note / Description (Optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        placeholder="e.g. Package packed and handed over to courier"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        {!isTerminal && (
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Updating..." : "Confirm Update"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
