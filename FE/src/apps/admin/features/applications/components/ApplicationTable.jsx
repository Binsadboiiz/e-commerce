import React from "react";
import ApplicationTableRow from "./ApplicationTableRow";
import Button from "@/shared/components/ui/Button";
import styles from "./ApplicationTable.module.css";

/**
 * ApplicationTable Component
 * Renders the table of seller applications with empty states and pagination.
 *
 * @param {Object} props
 * @param {Array} props.applications - List of application objects to display
 * @param {Function} props.onView - Callback when View is clicked
 * @param {Function} props.onApprove - Callback when Approve is clicked
 * @param {Function} props.onReject - Callback when Reject is clicked
 * @param {number} props.currentPage - Active page number
 * @param {number} props.totalPages - Total pages
 * @param {number} props.totalItems - Total item count
 * @param {Function} props.onPageChange - Callback when page changes
 */
export default function ApplicationTable({
    applications = [],
    onView,
    onStartReview,
    onApprove,
    onReject,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange
}) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Representative</th>
                        <th>Company / License</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <ApplicationTableRow
                            key={app.id}
                            app={app}
                            onView={onView}
                            onStartReview={onStartReview}
                            onApprove={onApprove}
                            onReject={onReject}
                        />
                    ))}

                    {applications.length === 0 && (
                        <tr>
                            <td colSpan="6" className={styles.emptyRow}>
                                No applications found for this filter.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {totalItems > 0 && totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages} ({totalItems} total)
                    </span>
                    <div className={styles.pageButtons}>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage >= totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
