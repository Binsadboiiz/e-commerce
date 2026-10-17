import React from "react";

/**
 * Standardized Button for Seller Center.
 * Handles primary, secondary, outline, danger, ghost variants and sizes.
 */
export default function SellerButton({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    icon = null,
    loading = false,
    disabled = false,
    className = "",
    onClick,
    ...rest
}) {
    const variantClass = `seller-btn-${variant}`;
    const sizeClass = `seller-btn-${size}`;

    const renderIconContent = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) return icon;
        if (typeof icon === "function" || (typeof icon === "object" && (icon.$$typeof || icon.render))) {
            const IconComponent = icon;
            return <IconComponent size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />;
        }
        return icon;
    };

    return (
        <button
            type={type}
            className={`seller-btn ${variantClass} ${sizeClass} ${className}`.trim()}
            disabled={disabled || loading}
            onClick={onClick}
            {...rest}
        >
            {loading ? (
                <span className="seller-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            ) : (
                icon && <span className="seller-btn-icon">{renderIconContent()}</span>
            )}
            {children}
        </button>
    );
}
