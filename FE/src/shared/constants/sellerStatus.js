/**
 * Master seller status constants matching backend SellerStatusConstants.cs and Seller_statuses database table.
 */
export const SELLER_STATUS = Object.freeze({
    DRAFT: "DRAFT",
    PENDING: "PENDING",
    UNDER_REVIEW: "UNDER_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    SUSPENDED: "SUSPENDED",
    BANNED: "BANNED",
    CLOSED: "CLOSED"
});

export default SELLER_STATUS;
