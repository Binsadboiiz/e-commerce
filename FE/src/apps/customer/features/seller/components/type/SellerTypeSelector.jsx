import React from 'react';
import { FiUser, FiBriefcase } from 'react-icons/fi';
import styles from './SellerTypeSelector.module.css';

export default function SellerTypeSelector({ value, onChange }) {
    const isPersonalSelected = value === 1 || value === 'PERSONAL';
    const isBusinessSelected = value === 2 || value === 'BUSINESS';
    const hasValue = value !== undefined && value !== null;

    return (
        <div className={styles.container}>
            <p className={styles.description}>
                Select the type of shop that best matches your business operations.
            </p>
            <div className={styles.grid}>
                {/* Personal Card */}
                <div 
                    className={`${styles.card} ${isPersonalSelected ? styles.selectedCard : ''} ${hasValue ? styles.disabledCard : ''}`}
                    onClick={() => !hasValue && onChange(1)}
                >
                    <div className={styles.iconWrapper}>
                        <FiUser size={32} />
                    </div>
                    <h3 className={styles.cardTitle}>Individual Seller</h3>
                    <p className={styles.cardText}>
                        For individual sellers, household businesses, or personal shops with no registered enterprise license.
                    </p>
                </div>

                {/* Business Card */}
                <div 
                    className={`${styles.card} ${isBusinessSelected ? styles.selectedCard : ''} ${hasValue ? styles.disabledCard : ''}`}
                    onClick={() => !hasValue && onChange(2)}
                >
                    <div className={styles.iconWrapper}>
                        <FiBriefcase size={32} />
                    </div>
                    <h3 className={styles.cardTitle}>Business Seller</h3>
                    <p className={styles.cardText}>
                        For registered corporations, organizations, brands, or official retail business license holders.
                    </p>
                </div>
            </div>
        </div>
    );
}