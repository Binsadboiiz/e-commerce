import React from "react";
import { FiUser, FiBriefcase } from "react-icons/fi";
import styles from "./SellerTypeSelector.module.css";

export default function SellerTypeSelector({
    value,
    sellerStatus,
    onCreate,
    onChangeType
}) {

    const isPersonalSelected = value === 1 || value === "PERSONAL";

    const isBusinessSelected = value === 2 || value === "BUSINESS";

    const isCreated = value !== undefined && value !== null;

    const canChange = isCreated && sellerStatus === "DRAFT";

    function handleSelect(typeId) {

        // Tạo mới
        if (!isCreated) {
            onCreate?.(typeId);
            return;
        }

        // Đổi sang cùng loại
        if (value === typeId) {
            return;
        }

        // Đổi loại hình
        if (canChange) {
            onChangeType?.(typeId);
        }
    }

    return (
        <div className={styles.container}>

            <p className={styles.description}>
                Select the type of shop that best matches your business operations.
            </p>

            {canChange && (
                <div className={styles.notice}>
                    Changing seller type will permanently remove all
                    registration information and uploaded documents.
                </div>
            )}

            <div className={styles.grid}>

                <div
                    className={`
                        ${styles.card}
                        ${isPersonalSelected ? styles.selectedCard : ""}
                        ${isCreated && !canChange ? styles.disabledCard : ""}
                    `}
                    onClick={() => handleSelect(1)}
                >
                    <div className={styles.iconWrapper}>
                        <FiUser size={32} />
                    </div>

                    <h3 className={styles.cardTitle}>
                        Individual Seller
                    </h3>

                    <p className={styles.cardText}>
                        For individual sellers, household businesses,
                        or personal shops with no registered enterprise
                        license.
                    </p>
                </div>

                <div
                    className={`
                        ${styles.card}
                        ${isBusinessSelected ? styles.selectedCard : ""}
                        ${isCreated && !canChange ? styles.disabledCard : ""}
                    `}
                    onClick={() => handleSelect(2)}
                >
                    <div className={styles.iconWrapper}>
                        <FiBriefcase size={32} />
                    </div>

                    <h3 className={styles.cardTitle}>
                        Business Seller
                    </h3>

                    <p className={styles.cardText}>
                        For registered corporations, organizations,
                        brands, or official retail business license
                        holders.
                    </p>
                </div>

            </div>

        </div>
    );
}