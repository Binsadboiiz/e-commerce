import React from "react";

/**
 * Standardized Form Field wrapper with Label, Required mark, Error & Helper text.
 */
export default function SellerFormField({
    label,
    required = false,
    error,
    helperText,
    children,
    className = "",
    htmlFor
}) {
    return (
        <div className={`seller-form-field ${className}`.trim()}>
            {label && (
                <label className="seller-label" htmlFor={htmlFor}>
                    {label}
                    {required && <span className="seller-label-required">*</span>}
                </label>
            )}
            {children}
            {error && <span className="seller-error-msg">{error}</span>}
            {!error && helperText && <span className="seller-helper-text">{helperText}</span>}
        </div>
    );
}
