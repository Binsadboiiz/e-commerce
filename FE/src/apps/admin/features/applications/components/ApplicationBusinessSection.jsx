import React from "react";
import styles from "./ApplicationDetail.module.css";

/**
 * ApplicationBusinessSection Component
 * Displays enterprise / business profile if the seller registered as Business.
 *
 * @param {Object} props
 * @param {Object} props.business - Business details object
 */
export default function ApplicationBusinessSection({ business }) {
    if (!business) return null;

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Business Information</h3>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Company Name</span>
                    <span className={styles.infoValue}>{business.companyName || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Tax Code</span>
                    <span className={styles.infoValue}>{business.taxCode || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>License Number</span>
                    <span className={styles.infoValue}>{business.businessLicenseNumber || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Representative</span>
                    <span className={styles.infoValue}>{business.representative || "-"}</span>
                </div>
            </div>
        </div>
    );
}
