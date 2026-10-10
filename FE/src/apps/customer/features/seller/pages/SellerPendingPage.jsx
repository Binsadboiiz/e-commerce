import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';
import { FiCheckCircle, FiClock, FiHome, FiFileText, FiChevronDown, FiChevronUp, FiXCircle, FiEdit3, FiCheck, FiX } from 'react-icons/fi';
import { sellerStoreApi } from '@/apps/seller/features/store/api/sellerStoreApi';
import { useLanguage } from '@/shared/context/LanguageContext';
import SellerReview from '../components/review/SellerReview';
import styles from './SellerPendingPage.module.css';

/**
 * Component displaying seller registration approval status (Pending, Approved, or Rejected).
 * Formatted as a clean, flat page layout. Auto-redirects to Seller Dashboard if shop is already created.
 */
export default function SellerPendingPage({ registration, onReEdit }) {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [showDetails, setShowDetails] = useState(false);
    const [shopCreated, setShopCreated] = useState(Boolean(registration?.summary?.hasShop));

    const statusCode = registration?.summary?.sellerStatusCode || 'PENDING';

    useEffect(() => {
        const checkShopStatus = async () => {
            try {
                const res = await sellerStoreApi.getShopStatus();
                const data = res?.data || res || {};
                if (data.hasShop) {
                    setShopCreated(true);
                    // Automatically redirect to seller dashboard if shop is already activated
                    navigate(ROUTES.SELLER_DASHBOARD || '/seller/dashboard', { replace: true });
                }
            } catch (err) {
                console.error("Failed to fetch shop status in SellerPendingPage:", err);
            }
        };
        checkShopStatus();
    }, [navigate]);

    const hasShop = shopCreated || Boolean(registration?.summary?.hasShop);
    const isApproved = statusCode === 'APPROVED';
    const isRejected = statusCode === 'REJECTED';

    return (
        <div className={styles.container}>
            <div className={styles.statusCard}>
                {/* Status Icon */}
                <div className={`${styles.iconWrapper} ${hasShop || isApproved ? styles.iconApproved : isRejected ? styles.iconRejected : ''}`}>
                    {hasShop || isApproved ? (
                        <FiCheckCircle size={44} style={{ color: '#2563eb' }} />
                    ) : isRejected ? (
                        <FiXCircle size={44} style={{ color: '#ef4444' }} />
                    ) : (
                        <FiCheckCircle size={44} style={{ color: '#2563eb' }} />
                    )}
                </div>

                {/* Header Title */}
                <h2 className={styles.title}>
                    {hasShop && t("sellerPending.titleActivated")}
                    {!hasShop && isApproved && t("sellerPending.titleApproved")}
                    {isRejected && t("sellerPending.titleRejected")}
                    {!isApproved && !isRejected && t("sellerPending.titleSubmitted")}
                </h2>

                {/* Description */}
                <p className={styles.description}>
                    {hasShop && t("sellerPending.descActivated")}
                    {!hasShop && isApproved && t("sellerPending.descApproved")}
                    {isRejected && t("sellerPending.descRejected")}
                    {!isApproved && !isRejected && t("sellerPending.descSubmitted")}
                </p>

                {/* Status Badge Notice */}
                {!isApproved && !isRejected && (
                    <div className={styles.noticeTime}>
                        <FiClock size={16} />
                        <span>{t("sellerPending.estimatedTime")}</span>
                    </div>
                )}

                {/* Timeline Status Node */}
                <div className={styles.timeline}>
                    <div className={styles.timelineLine} />
                    <div
                        className={`${styles.timelineProgress} ${hasShop || isApproved ? styles.progressFull : styles.progressHalf}`}
                    />

                    <div className={styles.timelineNode}>
                        <div className={`${styles.timelineCircle} ${styles.completedCircle}`}>
                            <FiCheck size={16} />
                        </div>
                        <span className={styles.timelineLabel}>{t("sellerPending.stepSubmitted")}</span>
                    </div>

                    <div className={styles.timelineNode}>
                        <div className={`${styles.timelineCircle} ${isApproved || isRejected || hasShop ? styles.completedCircle : styles.activeCircle}`}>
                            {isApproved || hasShop ? <FiCheck size={16} /> : isRejected ? <FiX size={16} /> : '2'}
                        </div>
                        <span className={styles.timelineLabel}>
                            {isApproved || hasShop ? t("sellerPending.stepApproved") : isRejected ? t("sellerPending.stepRejected") : t("sellerPending.stepReviewing")}
                        </span>
                    </div>

                    <div className={styles.timelineNode}>
                        <div className={`${styles.timelineCircle} ${hasShop || isApproved ? styles.completedCircle : ''}`}>
                            {hasShop || isApproved ? <FiCheck size={16} /> : '3'}
                        </div>
                        <span className={styles.timelineLabel}>{t("sellerPending.stepActivate")}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    {hasShop ? (
                        <button
                            className={styles.primaryButton}
                            onClick={() => navigate(ROUTES.SELLER_DASHBOARD || '/seller/dashboard')}
                        >
                            <span>{t("sellerPending.btnGoToPortal")}</span>
                        </button>
                    ) : isApproved ? (
                        <button
                            className={styles.primaryButton}
                            onClick={() => navigate(ROUTES.SELLER_SETUP_SHOP || '/seller/setup-shop')}
                        >
                            <span>{t("sellerPending.btnGoToPortal")}</span>
                        </button>
                    ) : null}

                    {isRejected && (
                        <button
                            className={styles.primaryButton}
                            onClick={onReEdit}
                        >
                            <FiEdit3 size={18} />
                            <span>{t("sellerPending.btnEditResubmit")}</span>
                        </button>
                    )}

                    {!isApproved && !isRejected && (
                        <button
                            className={styles.primaryButton}
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            <FiHome size={18} />
                            <span>{t("sellerPending.btnBackHome")}</span>
                        </button>
                    )}

                    {!hasShop && (
                        <button
                            className={styles.secondaryButton}
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            <FiFileText size={18} />
                            <span>{showDetails ? t("sellerPending.btnHideDetails") : t("sellerPending.btnReviewDetails")}</span>
                            {showDetails ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>
                    )}
                </div>
            </div>

            {!hasShop && showDetails && (
                <div className={styles.detailsWrapper}>
                    <SellerReview registration={registration} isReadOnly={true} />
                </div>
            )}
        </div>
    );
}