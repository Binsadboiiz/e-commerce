import React from "react";
import { Search, X } from "lucide-react";
import styles from "./ApplicationFilters.module.css";

/**
 * ApplicationFilters Component
 * Standardized search filter bar matching the Redirect Engine & Canonical Tags System.
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Active search text
 * @param {Function} props.onSearchChange - Callback when search input changes
 * @param {number} [props.totalCount] - Number of matching results
 */
export default function ApplicationFilters({
    searchQuery,
    onSearchChange,
    totalCount
}) {
    return (
        <div className={styles.filterContainer}>
            <div className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search by representative, email, phone, company, tax code..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Search seller applications"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className={styles.clearButton}
                        title="Clear search"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {totalCount !== undefined && (
                <div className={styles.countBadge}>
                    Found: <strong>{totalCount}</strong> {totalCount === 1 ? "application" : "applications"}
                </div>
            )}
        </div>
    );
}
