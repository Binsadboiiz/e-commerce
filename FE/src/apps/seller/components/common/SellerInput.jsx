import React, { forwardRef } from "react";
import { Search } from "lucide-react";

/**
 * Standardized Input for Seller Center.
 */
const SellerInput = forwardRef(function SellerInput({
    type = "text",
    size = "md",
    error = false,
    icon = null,
    search = false,
    className = "",
    disabled = false,
    ...rest
}, ref) {
    const errorClass = error ? "seller-input-error" : "";
    const sizeClass = size === "sm" ? "seller-input-sm" : "";

    const activeIcon = search && !icon ? Search : icon;

    const renderIconContent = () => {
        if (!activeIcon) return null;
        if (React.isValidElement(activeIcon)) return activeIcon;
        if (typeof activeIcon === "function" || (typeof activeIcon === "object" && (activeIcon.$$typeof || activeIcon.render))) {
            const IconComponent = activeIcon;
            return <IconComponent size={16} />;
        }
        return activeIcon;
    };

    if (activeIcon) {
        return (
            <div className="seller-search-wrapper">
                <span className="seller-search-icon">{renderIconContent()}</span>
                <input
                    ref={ref}
                    type={type}
                    className={`seller-search-input ${errorClass} ${className}`.trim()}
                    disabled={disabled}
                    {...rest}
                />
            </div>
        );
    }

    return (
        <input
            ref={ref}
            type={type}
            className={`seller-input ${sizeClass} ${errorClass} ${className}`.trim()}
            disabled={disabled}
            {...rest}
        />
    );
});

export default SellerInput;
