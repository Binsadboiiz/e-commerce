import React from "react";
import Button from "@/shared/components/ui/Button";
import { AdminDetailModalSkeleton } from "@/apps/admin/components/AdminTableSkeleton";
import ApplicationOverview from "./ApplicationOverview";
import ApplicationAddressSection from "./ApplicationAddressSection";
import ApplicationBankSection from "./ApplicationBankSection";
import ApplicationBusinessSection from "./ApplicationBusinessSection";
import VerificationDocumentsSection from "./VerificationDocumentsSection";
import { SELLER_STATUS } from "../constants/applicationConstants";
import styles from "./ApplicationDetail.module.css";

/**
 * ApplicationDetailPage Component
 * Detailed view modal adhering to Flat Section Layout rules.
 * Supports read-only mode for APPROVED and REJECTED applications.
 *
 * @param {Object} props
 * @param {Object} props.detail - Detailed application object
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} [props.onStartReview] - Callback when Start Review is clicked
 * @param {Function} props.onApprove - Callback when Approve is clicked
 * @param {Function} props.onReject - Callback when Reject is clicked
 */
export default function ApplicationDetailPage({
    detail,
    loading = false,
    onClose,
    onStartReview,
    onApprove,
    onReject
}) {
    if (!detail) return null;

    const summary = detail?.summary;
    const statusCode = summary?.sellerStatusCode;
    const isPending = statusCode === SELLER_STATUS.PENDING;
    const isUnderReview = statusCode === SELLER_STATUS.UNDER_REVIEW;
    const isActionable = isPending || isUnderReview;
    const applicantName = detail?.address?.fullName || detail?.business?.companyName || "Applicant";

    return (
        <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Application Detail</h2>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <AdminDetailModalSkeleton />
                ) : (
                    <div className={styles.modalBody}>
                        {/* 1. Overview */}
                        <ApplicationOverview summary={summary} />

                        {/* 2. Address */}
                        <ApplicationAddressSection address={detail.address} />

                        {/* 3. Bank Account */}
                        <ApplicationBankSection bank={detail.bank} />

                        {/* 4. Business Information (if present) */}
                        <ApplicationBusinessSection business={detail.business} />

                        {/* 5. Verification Documents */}
                        <VerificationDocumentsSection documents={detail.documents} />

                        {/* Modal Action Bar */}
                        <div className={styles.modalActions}>
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Close
                            </Button>

                            {isPending && onStartReview && (
                                <Button
                                    variant="primary"
                                    onClick={() => onStartReview(summary.sellerId, applicantName)}
                                >
                                    Start Review
                                </Button>
                            )}

                            {isUnderReview && (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={() => onReject(summary.sellerId, applicantName)}
                                    >
                                        ✕ Reject
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => onApprove(summary.sellerId, applicantName)}
                                    >
                                        ✓ Approve
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
