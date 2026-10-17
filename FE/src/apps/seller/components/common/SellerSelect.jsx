import React, { forwardRef } from "react";

/**
 * Standardized Select for Seller Center.
 */
const SellerSelect = forwardRef(function SellerSelect({
    error = false,
    options = [],
    className = "",
    children,
    disabled = false,
    ...rest
}, ref) {
    const errorClass = error ? "seller-select-error" : "";

    return (
        <select
            ref={ref}
            className={`seller-select ${errorClass} ${className}`.trim()}
            disabled={disabled}
            {...rest}
        >
            {options.length > 0
                ? options.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                    </option>
                ))
                : children
            }
        </select>
    );
});

export default SellerSelect;
