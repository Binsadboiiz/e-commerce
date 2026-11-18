import { SELLER_STATUS } from "@/shared/constants/sellerStatus";

export { SELLER_STATUS };

/**
 * Filter tab keys for Admin Seller Applications.
 * Maps 1-1 with backend status codes, plus the meta key 'ALL'.
 */
export const TAB_KEYS = Object.freeze({
    PENDING: SELLER_STATUS.PENDING,
    UNDER_REVIEW: SELLER_STATUS.UNDER_REVIEW,
    APPROVED: SELLER_STATUS.APPROVED,
    REJECTED: SELLER_STATUS.REJECTED,
    ALL: "ALL"
});

/**
 * Tab configuration items for rendering tab list and counts.
 */
export const TABS_CONFIG = Object.freeze([
    { key: TAB_KEYS.PENDING, label: "Pending" },
    { key: TAB_KEYS.UNDER_REVIEW, label: "Under Review" },
    { key: TAB_KEYS.APPROVED, label: "Approved" },
    { key: TAB_KEYS.REJECTED, label: "Rejected" },
    { key: TAB_KEYS.ALL, label: "All" }
]);

/**
 * Standard decision actions handled by the confirmation dialog and API handlers.
 */
export const DECISION_TYPES = Object.freeze({
    START_REVIEW: "START_REVIEW",
    APPROVE: "APPROVE",
    REJECT: "REJECT"
});
