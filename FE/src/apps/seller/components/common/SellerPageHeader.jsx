import React from "react";

/**
 * Standardized Page Header for Seller Center.
 * Supports title, subtitle, count badge, and actions slot.
 */
export default function SellerPageHeader({
    title,
    subtitle,
    count,
    actions,
    children,
    className = ""
}) {
    const actionSlot = actions || children;

    return (
        <div className={`seller-page-header ${className}`.trim()}>
            <div className="seller-page-header-content">
                <h1 className="seller-page-title">
                    {title}
                    {count !== undefined && count !== null && (
                        <span className="seller-badge seller-badge-neutral">
                            {count}
                        </span>
                    )}
                </h1>
                {subtitle && <p className="seller-page-subtitle">{subtitle}</p>}
            </div>
            {actionSlot && <div className="seller-page-actions">{actionSlot}</div>}
        </div>
    );
}
