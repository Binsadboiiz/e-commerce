import React from "react";
import { PackageOpen } from "lucide-react";
import SellerButton from "./SellerButton";

/**
 * Standardized Empty State for Seller Center lists, tables, and search results.
 */
export default function SellerEmptyState({
    icon = PackageOpen,
    title = "No data found",
    description = "There are no records matching your current filter.",
    action = null,
    actionLabel = null,
    onAction = null,
    className = ""
}) {
    const renderIconContent = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) return icon;
        if (typeof icon === "function" || (typeof icon === "object" && (icon.$$typeof || icon.render))) {
            const IconComponent = icon;
            return <IconComponent size={40} />;
        }
        return icon;
    };

    return (
        <div className={`seller-empty-state ${className}`.trim()}>
            {icon && <div className="seller-empty-icon">{renderIconContent()}</div>}
            {title && <h4 className="seller-empty-title">{title}</h4>}
            {description && <p className="seller-empty-desc">{description}</p>}
            {action ? (
                <div>{action}</div>
            ) : actionLabel && onAction ? (
                <div style={{ marginTop: "14px" }}>
                    <SellerButton variant="primary" onClick={onAction}>
                        {actionLabel}
                    </SellerButton>
                </div>
            ) : null}
        </div>
    );
}
