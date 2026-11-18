import React from "react";
import styles from "./ApplicationDetail.module.css";

/**
 * ApplicationBankSection Component
 * Displays payout bank account information.
 *
 * @param {Object} props
 * @param {Object} props.bank - Bank details object
 */
export default function ApplicationBankSection({ bank }) {
    if (!bank) return null;

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Bank Account</h3>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Bank</span>
                    <span className={styles.infoValue}>{bank.bankCode || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Account Number</span>
                    <span className={styles.infoValue}>{bank.accountNumber || "-"}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Account Holder</span>
                    <span className={styles.infoValue}>{bank.accountName || "-"}</span>
                </div>
            </div>
        </div>
    );
}
