import React, { useState } from "react";
import { FiCheckCircle, FiEdit3, FiFileText, FiSend, FiShield, FiUser, FiMapPin, FiCreditCard, FiBriefcase, FiEye } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerReview.module.css";

export default function SellerReview({
    registration,
    onSubmit,
    onEditStep,
    isReadOnly = false
}) {
    const { t } = useLanguage();
    const [agreed, setAgreed] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!registration) {
        return null;
    }

    const {
        summary,
        address,
        bank,
        business,
        documents = []
    } = registration;

    const isBusiness = summary?.sellerTypeCode === "BUSINESS";
    const sellerTypeName = isBusiness ? t("sellerReview.sellerTypeBusiness") : t("sellerReview.sellerTypePersonal");

    const getStatusBadge = (code) => {
        switch (code) {
            case "APPROVED":
                return <span className={styles.statusBadgeApproved}>{t("sellerReview.statusApproved")}</span>;
            case "PENDING":
            case "UNDER_REVIEW":
                return <span className={styles.statusBadgePending}>{t("sellerReview.statusPending")}</span>;
            case "REJECTED":
                return <span className={styles.statusBadgeRejected}>{t("sellerReview.statusRejected")}</span>;
            default:
                return <span className={styles.statusBadge}>{t("sellerReview.statusDraft")}</span>;
        }
    };

    const handleSubmit = async () => {
        if (!agreed) return;
        try {
            setIsSubmitting(true);
            await onSubmit?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    const mapDocTypeToName = (type) => {
        switch (type) {
            case "IDENTITY_FRONT":
                return t("sellerReview.identityFront");
            case "IDENTITY_BACK":
                return t("sellerReview.identityBack");
            case "BUSINESS_LICENSE":
                return t("sellerReview.businessLicense");
            default:
                return type ? type.replace('_', ' ') : "-";
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.sectionTitleRow}>
                    <h3>{t("sellerReview.title")}</h3>
                </div>
                <p className={styles.headerDesc}>
                    {t("sellerReview.subtitle")}
                </p>
            </div>

            {/* Section 1: Seller Type */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderTitle}>
                        <h4>{t("sellerReview.sectionType")}</h4>
                    </div>
                    {!isReadOnly && onEditStep && (
                        <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => onEditStep(0)}
                        >
                            <FiEdit3 size={14} />
                            <span>{t("sellerReview.btnEdit")}</span>
                        </button>
                    )}
                </div>

                <div className={styles.grid}>
                    <Item
                        label={t("sellerReview.sellerTypeLabel")}
                        value={sellerTypeName}
                    />
                    <Item
                        label={t("sellerReview.statusLabel")}
                        value={getStatusBadge(summary?.sellerStatusCode)}
                    />
                </div>
            </section>

            {/* Section 2: Contact & Address */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderTitle}>
                        <h4>{t("sellerReview.sectionContact")}</h4>
                    </div>
                    {!isReadOnly && onEditStep && (
                        <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => onEditStep(1)}
                        >
                            <FiEdit3 size={14} />
                            <span>{t("sellerReview.btnEdit")}</span>
                        </button>
                    )}
                </div>

                <div className={styles.grid}>
                    <Item
                        label={t("sellerReview.fullName")}
                        value={address?.fullName}
                    />
                    <Item
                        label={t("sellerReview.phone")}
                        value={address?.phoneNumber}
                    />
                    <Item
                        label={t("sellerReview.city")}
                        value={address?.city}
                    />
                    <Item
                        label={t("sellerReview.district")}
                        value={address?.district}
                    />
                    <Item
                        label={t("sellerReview.ward")}
                        value={address?.ward}
                    />
                    <Item
                        label={t("sellerReview.postalCode")}
                        value={address?.postalCode || t("sellerReview.none")}
                    />
                    <div className={styles.fullWidthItem}>
                        <Item
                            label={t("sellerReview.streetAddress")}
                            value={address?.streetAddress}
                        />
                    </div>
                </div>
            </section>

            {/* Section 3: Bank Account */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderTitle}>
                        <h4>{t("sellerReview.sectionBank")}</h4>
                    </div>
                    {!isReadOnly && onEditStep && (
                        <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => onEditStep(2)}
                        >
                            <FiEdit3 size={14} />
                            <span>{t("sellerReview.btnEdit")}</span>
                        </button>
                    )}
                </div>

                <div className={styles.grid}>
                    <Item
                        label={t("sellerReview.bankName")}
                        value={bank?.bankCode}
                    />
                    <Item
                        label={t("sellerReview.accountName")}
                        value={bank?.accountName}
                    />
                    <Item
                        label={t("sellerReview.accountNumber")}
                        value={bank?.accountNumber}
                    />
                </div>
            </section>

            {/* Section 4: Business Info (if business) */}
            {business && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionHeaderTitle}>
                            <h4>{t("sellerReview.sectionBusiness")}</h4>
                        </div>
                        {!isReadOnly && onEditStep && (
                            <button
                                type="button"
                                className={styles.editBtn}
                                onClick={() => onEditStep(3)}
                            >
                                <FiEdit3 size={14} />
                                <span>{t("sellerReview.btnEdit")}</span>
                            </button>
                        )}
                    </div>

                    <div className={styles.grid}>
                        <Item
                            label={t("sellerReview.companyName")}
                            value={business.companyName}
                        />
                        <Item
                            label={t("sellerReview.taxCode")}
                            value={business.taxCode}
                        />
                        <Item
                            label={t("sellerReview.businessLicenseNumber")}
                            value={business.businessLicenseNumber}
                        />
                        <Item
                            label={t("sellerReview.representative")}
                            value={business.representative}
                        />
                    </div>
                </section>
            )}

            {/* Section 5: Verification Documents */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderTitle}>
                        <h4>{t("sellerReview.sectionDocs")}</h4>
                    </div>
                    {!isReadOnly && onEditStep && (
                        <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => onEditStep(isBusiness ? 4 : 3)}
                        >
                            <FiEdit3 size={14} />
                            <span>{t("sellerReview.btnEdit")}</span>
                        </button>
                    )}
                </div>

                <div className={styles.documentList}>
                    {documents.length === 0 && (
                        <div className={styles.noDoc}>{t("sellerReview.noDocs")}</div>
                    )}

                    {documents.map(document => {
                        const docName = mapDocTypeToName(document.documentType);
                        return (
                            <div key={document.documentId || document.documentType} className={styles.documentRow}>
                                <div className={styles.documentInfo}>
                                    <span className={styles.documentName}>{docName}</span>
                                </div>

                                {document.fileUrl ? (
                                    <a
                                        href={document.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.viewBtn}
                                        title={t("sellerDocument.viewFile")}
                                    >
                                        <FiEye size={14} />
                                        <span>{t("sellerDocument.viewFile")}</span>
                                    </a>
                                ) : (
                                    <span className={styles.badgePending}>{t("sellerDocument.notUploaded")}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Terms and Submit */}
            {!isReadOnly && summary?.sellerStatusCode !== "PENDING" && summary?.sellerStatusCode !== "UNDER_REVIEW" && (
                <div className={styles.footerArea}>
                    <label className={styles.termsLabel}>
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className={styles.termsCheckbox}
                        />
                        <strong>
                            {t("sellerReview.termsCommitment")} <a href="#terms" onClick={(e) => e.preventDefault()}>{t("sellerReview.sellerTerms")}</a>.
                        </strong>
                    </label>

                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={!agreed || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className={styles.miniSpinner}></div>
                                <span>{t("sellerReview.submitting")}</span>
                            </>
                        ) : (
                            <span>{t("sellerReview.btnSubmit")}</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

function Item({ label, value }) {
    return (
        <div className={styles.item}>
            <span className={styles.itemLabel}>{label}</span>
            <strong className={styles.itemValue}>{value || "-"}</strong>
        </div>
    );
}