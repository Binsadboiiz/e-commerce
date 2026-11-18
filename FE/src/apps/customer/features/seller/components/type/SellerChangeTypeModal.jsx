import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./SellerChangeTypeModal.module.css";

export default function SellerChangeTypeModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconContainer}>
                    <FiAlertTriangle className={styles.warningIcon} size={40} />
                </div>
                
                <h3 className={styles.title}>Warning</h3>
                
                <p className={styles.message}>
                    Changing seller type will:
                </p>
                
                <ul className={styles.list}>
                    <li>Remove address</li>
                    <li>Remove bank account</li>
                    <li>Remove business information</li>
                    <li>Remove uploaded documents</li>
                </ul>
                
                <p className={styles.subMessage}>
                    This action cannot be undone.
                </p>
                
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>
                        Change
                    </button>
                </div>
            </div>
        </div>
    );
}
