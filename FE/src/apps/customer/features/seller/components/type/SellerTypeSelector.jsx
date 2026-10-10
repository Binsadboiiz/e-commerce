import React from "react";
import { FiCheck } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerTypeSelector.module.css";

export default function SellerTypeSelector({
    value,
    code,
    sellerStatus,
    onCreate,
    onChangeType
}) {
    const { t, lang } = useLanguage();

    const isPersonalSelected =
        value === 1 ||
        String(value) === "1" ||
        code === "PERSONAL" ||
        value === "PERSONAL";

    const isBusinessSelected =
        value === 2 ||
        String(value) === "2" ||
        code === "BUSINESS" ||
        value === "BUSINESS";

    const isCreated = value !== undefined && value !== null && value !== "";
    const canChange = isCreated && (sellerStatus === "DRAFT" || !sellerStatus);

    function handleSelect(typeId) {
        if (!isCreated) {
            onCreate?.(typeId);
            return;
        }

        const isCurrentSelection =
            (typeId === 1 && isPersonalSelected) ||
            (typeId === 2 && isBusinessSelected);

        if (isCurrentSelection) {
            return;
        }

        if (canChange) {
            onChangeType?.(typeId);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h3 className={styles.headingTitle}>{t("sellerOnboarding.selectTypeTitle")}</h3>
                <p className={styles.description}>
                    {t("sellerOnboarding.selectTypeDesc")}
                </p>
            </div>

            {canChange && (
                <div className={styles.notice}>
                    <span>
                        <strong>{lang === 'vi' ? 'Lưu ý:' : 'Note:'}</strong> {t("sellerOnboarding.selectTypeNotice")}
                    </span>
                </div>
            )}

            <div className={styles.grid}>
                {/* Personal / Individual Card */}
                <div
                    className={`
                        ${styles.card}
                        ${isPersonalSelected ? styles.selectedCard : ""}
                        ${isCreated && !canChange ? styles.disabledCard : ""}
                    `}
                    onClick={() => handleSelect(1)}
                >
                    <h3 className={styles.cardTitle}>
                        {t("sellerOnboarding.personalTitle")}
                    </h3>

                    <p className={styles.cardText}>
                        {t("sellerOnboarding.personalDesc")}
                    </p>

                    <ul className={styles.featureList}>
                        <li>
                            <FiCheck className={styles.featureCheck} size={15} />
                            <span>{t("sellerOnboarding.personalFeature1")}</span>
                        </li>
                        <li>
                            <FiCheck className={styles.featureCheck} size={15} />
                            <span>{t("sellerOnboarding.personalFeature2")}</span>
                        </li>
                        <li>
                            <FiCheck className={styles.featureCheck} size={15} />
                            <span>{t("sellerOnboarding.personalFeature3")}</span>
                        </li>
                    </ul>
                </div>

                {/* Business Card */}
                <div
                    className={`
                        ${styles.card}
                        ${isBusinessSelected ? styles.selectedCard : ""}
                        ${isCreated && !canChange ? styles.disabledCard : ""}
                    `}
                    onClick={() => handleSelect(2)}
                >
                    <h3 className={styles.cardTitle}>
                        {t("sellerOnboarding.businessTitle")}
                    </h3>

                    <p className={styles.cardText}>
                        {t("sellerOnboarding.businessDesc")}
                    </p>

                    <ul className={styles.featureList}>
                        <li>
                            <FiCheck className={styles.featureCheck} size={15} />
                            <span>{t("sellerOnboarding.businessFeature1")}</span>
                        </li>
                        <li>
                            <FiCheck className={styles.featureCheck} size={15} />
                            <span>{t("sellerOnboarding.businessFeature2")}</span>
                        </li>
                        <li>
                            <FiCheck className={styles.featureCheck} size={15} />
                            <span>{t("sellerOnboarding.businessFeature3")}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}