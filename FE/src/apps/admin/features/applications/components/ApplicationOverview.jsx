import React from "react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import styles from "./ApplicationDetail.module.css";

/**
 * ApplicationOverview Component
 * Displays summary metadata of the application in Flat Section Layout.
 *
 * @param {Object} props
 * @param {Object} props.summary - Summary object containing sellerTypeCode, sellerStatusCode, etc.
 */
export default function ApplicationOverview({ summary }) {
    if (!summary) return null;

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Overview</h3>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Seller Type</span>
                    <span className={styles.infoValue}>{summary.sellerTypeCode || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Status</span>
                    <div>
                        <ApplicationStatusBadge status={summary.sellerStatusCode} />
                    </div>
                </div>
                {summary.maxShopLimit !== undefined && (
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Max Shop Limit</span>
                        <span className={styles.infoValue}>{summary.maxShopLimit}</span>
                    </div>
                )}
            </div>

            {summary.rejectionReason && (
                <div className={styles.rejectionNotice}>
                    <span className={styles.rejectionNoticeLabel}>Rejection Reason:</span>
                    <p className={styles.rejectionNoticeText}>{summary.rejectionReason}</p>
                </div>
            )}
        </div>
    );
}
