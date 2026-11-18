import React, { forwardRef } from "react";

/**
 * Standardized Textarea for Seller Center.
 */
const SellerTextarea = forwardRef(function SellerTextarea({
    error = false,
    className = "",
    disabled = false,
    ...rest
}, ref) {
    const errorClass = error ? "seller-textarea-error" : "";

    return (
        <textarea
            ref={ref}
            className={`seller-textarea ${errorClass} ${className}`.trim()}
            disabled={disabled}
            {...rest}
        />
    );
});

export default SellerTextarea;
