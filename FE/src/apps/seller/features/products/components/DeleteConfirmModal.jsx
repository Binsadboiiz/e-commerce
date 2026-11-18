import React from "react";
import { Trash2 } from "lucide-react";
import { SellerModal, SellerButton } from "@/apps/seller/components/common";

/**
 * Standardized Delete Confirmation Modal for Seller Products.
 * Uses shared SellerModal and SellerButton design system components.
 */
export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    product,
    isSubmitting
}) {
    if (!isOpen || !product) return null;

    return (
        <SellerModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Deletion"
            maxWidth="440px"
            footer={
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", width: "100%" }}>
                    <SellerButton
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </SellerButton>
                    <SellerButton
                        variant="danger"
                        onClick={onConfirm}
                        loading={isSubmitting}
                        icon={<Trash2 size={16} />}
                    >
                        Delete Product
                    </SellerButton>
                </div>
            }
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "12px 0" }}>
                <div
                    style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "var(--seller-danger-bg)",
                        color: "var(--seller-danger)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                    }}
                >
                    <Trash2 size={26} />
                </div>
                <p style={{ fontSize: "14px", color: "var(--seller-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    Are you sure you want to delete product <strong style={{ color: "var(--seller-text-main)" }}>"{product.name}"</strong>?
                    <br /><br />
                    The product will be moved to deleted status and will no longer be visible on your store.
                </p>
            </div>
        </SellerModal>
    );
}
