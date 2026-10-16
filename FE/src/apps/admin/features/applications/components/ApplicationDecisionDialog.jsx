import React, { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { DECISION_TYPES } from "../constants/applicationConstants";
import styles from "./ApplicationDecisionDialog.module.css";

/**
 * ApplicationDecisionDialog Component
 * Modal dialog for confirming Start Review, Approval, or Rejection (with validated reason input).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {string} props.type - Action type from DECISION_TYPES
 * @param {string} props.applicationId - Target seller ID
 * @param {string} props.applicationName - Target applicant name
 * @param {boolean} props.isSubmitting - Loading state during submission
 * @param {Function} props.onClose - Callback to close dialog
 * @param {Function} props.onConfirmStartReview - Callback when start review is confirmed
 * @param {Function} props.onConfirmApprove - Callback when approval is confirmed
 * @param {Function} props.onConfirmReject - Callback when rejection is confirmed (receives reason)
 */
export default function ApplicationDecisionDialog({
    isOpen,
    type,
    applicationId,
    applicationName,
    isSubmitting = false,
    onClose,
    onConfirmStartReview,
    onConfirmApprove,
    onConfirmReject
}) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const isStartReview = type === DECISION_TYPES.START_REVIEW;
    const isApprove = type === DECISION_TYPES.APPROVE;
    const isReject = type === DECISION_TYPES.REJECT;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isStartReview) {
            onConfirmStartReview?.(applicationId);
        } else if (isApprove) {
            onConfirmApprove?.(applicationId);
        } else if (isReject) {
            if (!reason.trim()) {
                setError("Please provide a rejection reason so the applicant knows what to update.");
                return;
            }
            setError("");
            onConfirmReject?.(applicationId, reason.trim());
        }
    };

    let dialogTitle = "Confirm Decision";
    let submitButtonText = "Confirm";
    let submitVariant = "primary";

    if (isStartReview) {
        dialogTitle = "Start Application Review";
        submitButtonText = "Start Review";
        submitVariant = "primary";
    } else if (isApprove) {
        dialogTitle = "Confirm Application Approval";
        submitButtonText = "Confirm Approval";
        submitVariant = "success";
    } else if (isReject) {
        dialogTitle = "Reject Seller Application";
        submitButtonText = "Confirm Rejection";
        submitVariant = "danger";
    }

    return (
        <div className={styles.dialogOverlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dialogHeader}>
                    <h3 className={styles.dialogTitle}>{dialogTitle}</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.dialogBody}>
                        {isStartReview && (
                            <p className={styles.dialogMessage}>
                                Are you sure you want to start reviewing the application for{" "}
                                <strong>{applicationName || "this applicant"}</strong>?
                                The status will transition to <strong>Under Review</strong>.
                            </p>
                        )}

                        {isApprove && (
                            <p className={styles.dialogMessage}>
                                Are you sure you want to approve the seller application for{" "}
                                <strong>{applicationName || "this applicant"}</strong>?
                                The seller account will be activated and granted access to the Seller Center.
                            </p>
                        )}

                        {isReject && (
                            <>
                                <p className={styles.dialogMessage}>
                                    Are you sure you want to reject the seller application for{" "}
                                    <strong>{applicationName || "this applicant"}</strong>?
                                </p>
                                <div>
                                    <label htmlFor="rejectionReason" className={styles.reasonLabel}>
                                        Rejection Reason <span className={styles.requiredStar}>*</span>
                                    </label>
                                    <textarea
                                        id="rejectionReason"
                                        className={styles.reasonTextarea}
                                        value={reason}
                                        onChange={(e) => {
                                            setReason(e.target.value);
                                            if (error) setError("");
                                        }}
                                        placeholder="Explain why the application is rejected (e.g. illegible documents, invalid tax code)..."
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                    {error && <div className={styles.errorText}>{error}</div>}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.dialogActions}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={submitVariant}
                            isLoading={isSubmitting}
                        >
                            {submitButtonText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
