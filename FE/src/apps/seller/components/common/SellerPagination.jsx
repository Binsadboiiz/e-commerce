import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Standardized Pagination component for Seller Center.
 */
export default function SellerPagination({
    page = 1,
    pageSize = 20,
    total = 0,
    totalPages = 1,
    onPageChange,
    className = ""
}) {
    if (total <= 0 || totalPages <= 1) return null;

    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className={`seller-pagination ${className}`.trim()}>
            <span className="seller-helper-text" style={{ margin: 0 }}>
                Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{total}</strong> items
            </span>

            <div className="seller-pagination-controls">
                <button
                    type="button"
                    className="seller-pagination-btn"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                            <React.Fragment key={p}>
                                {prev && p - prev > 1 && (
                                    <span style={{ padding: "0 4px", color: "var(--seller-text-muted)" }}>...</span>
                                )}
                                <button
                                    type="button"
                                    className={`seller-pagination-btn ${p === page ? "seller-pagination-btn-active" : ""}`}
                                    onClick={() => onPageChange(p)}
                                >
                                    {p}
                                </button>
                            </React.Fragment>
                        );
                    })}

                <button
                    type="button"
                    className="seller-pagination-btn"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
