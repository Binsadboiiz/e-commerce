import React from "react";
import styles from "./ApplicationDetail.module.css";

/**
 * ApplicationAddressSection Component
 * Displays seller contact and warehouse address details.
 *
 * @param {Object} props
 * @param {Object} props.address - Address details
 */
export default function ApplicationAddressSection({ address }) {
    if (!address) return null;

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Address</h3>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Full Name</span>
                    <span className={styles.infoValue}>{address.fullName || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone</span>
                    <span className={styles.infoValue}>{address.phoneNumber || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>City / Province</span>
                    <span className={styles.infoValue}>{address.city || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>District</span>
                    <span className={styles.infoValue}>{address.district || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ward</span>
                    <span className={styles.infoValue}>{address.ward || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Postal Code</span>
                    <span className={styles.infoValue}>{address.postalCode || "-"}</span>
                </div>
                <div className={styles.infoItem} style={{ gridColumn: "1 / -1" }}>
                    <span className={styles.infoLabel}>Street Address</span>
                    <span className={styles.infoValue}>{address.streetAddress || "-"}</span>
                </div>
            </div>
        </div>
    );
}
