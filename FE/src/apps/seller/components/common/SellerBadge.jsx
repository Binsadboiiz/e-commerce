import React from "react";

/**
 * Standardized Status Badge for Seller Center.
 * Supports success, warning, danger, info, neutral, primary variants.
 */
export default function SellerBadge({
    children,
    variant = "neutral",
    showDot = true,
    className = ""
}) {
    const variantClass = `seller-badge-${variant}`;

    return (
        <span className={`seller-badge ${variantClass} ${className}`.trim()}>
            {showDot && <span className="seller-badge-dot" />}
            {children}
        </span>
    );
}
