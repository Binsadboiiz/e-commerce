import React from "react";

/**
 * Standardized Card Container for Seller Center.
 */
export default function SellerCard({
    title,
    subtitle,
    action,
    children,
    className = "",
    headerClassName = "",
    ...rest
}) {
    const hasHeader = title || action;

    return (
        <div className={`seller-card ${className}`.trim()} {...rest}>
            {hasHeader && (
                <div className={`seller-card-header ${headerClassName}`.trim()}>
                    <div>
                        {title && <h3 className="seller-card-title">{title}</h3>}
                        {subtitle && <p className="seller-helper-text" style={{ margin: 0 }}>{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
