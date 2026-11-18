import React from "react";

/**
 * Standardized Data Table for Seller Center.
 */
export default function SellerTable({
    headers = [],
    children,
    emptyState = null,
    footer = null,
    className = "",
    tableClassName = ""
}) {
    return (
        <div className={`seller-table-container ${className}`.trim()}>
            <table className={`seller-table ${tableClassName}`.trim()}>
                {headers.length > 0 && (
                    <thead>
                        <tr>
                            {headers.map((h, idx) => (
                                <th key={idx}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {children}
                </tbody>
            </table>
            {emptyState}
            {footer}
        </div>
    );
}
