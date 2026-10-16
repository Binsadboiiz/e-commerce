import React from "react";
import Button from "@/shared/components/ui/Button";
import { SELLER_STATUS } from "../constants/applicationConstants";

/**
 * ApplicationActions Component
 * Renders actions according to application status and workflow rules.
 * - PENDING: Start Review, View, Approve, Reject
 * - UNDER_REVIEW: View, Approve, Reject
 * - APPROVED / REJECTED: View only (read-only mode)
 *
 * @param {Object} props
 * @param {Object} props.app - The application record
 * @param {Function} props.onView - Callback to view detail
 * @param {Function} [props.onStartReview] - Callback to trigger start review confirmation
 * @param {Function} props.onApprove - Callback to trigger approval confirmation
 * @param {Function} props.onReject - Callback to trigger rejection confirmation
 */
export default function ApplicationActions({
    app,
    onView,
    onStartReview,
    onApprove,
    onReject
}) {
    if (!app) return null;

    const isPending = app.status === SELLER_STATUS.PENDING;
    const isUnderReview = app.status === SELLER_STATUS.UNDER_REVIEW;
    const isActionable = isPending || isUnderReview;
    const targetName = app.representative || app.companyName;

    return (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
                size="sm"
                variant="outline"
                onClick={() => onView(app.id)}
            >
                View
            </Button>

            {isPending && onStartReview && (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onStartReview(app.id, targetName)}
                >
                    Start Review
                </Button>
            )}

            {isUnderReview && (
                <>
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => onApprove(app.id, targetName)}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onReject(app.id, targetName)}
                    >
                        Reject
                    </Button>
                </>
            )}
        </div>
    );
}
