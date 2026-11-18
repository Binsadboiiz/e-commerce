import React from "react";

/**
 * Standardized Status Badge for Seller Center.
 * Supports success, warning, danger, info, neutral, primary variants.
 */
export default function SellerBadge({
    children,
    variant = "neutral",
    showDot = true,
    dot = undefined,
    className = ""
}) {
    const variantClass = `seller-badge-${variant}`;
    const hasDot = dot !== undefined ? dot : showDot;

    return (
        <span className={`seller-badge ${variantClass} ${className}`.trim()}>
            {hasDot && <span className="seller-badge-dot" />}
            {children}
        </span>
    );
}
