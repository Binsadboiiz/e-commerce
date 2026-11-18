import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Standardized Modal for Seller Center.
 */
export default function SellerModal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = "600px",
    className = "",
    bodyClassName = "",
    showCloseButton = true
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="seller-modal-overlay" onClick={onClose}>
            <div
                className={`seller-modal-container ${className}`.trim()}
                style={{ maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="seller-modal-header">
                        <h2 className="seller-modal-title">{title}</h2>
                        {showCloseButton && (
                            <button
                                type="button"
                                className="seller-modal-close-btn"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}
                <div className={`seller-modal-body ${bodyClassName}`.trim()}>
                    {children}
                </div>
                {footer && (
                    <div className="seller-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
