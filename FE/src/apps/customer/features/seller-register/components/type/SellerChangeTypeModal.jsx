import React, { useEffect } from "react";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerChangeTypeModal.module.css";

export default function SellerChangeTypeModal({ isOpen, onClose, onConfirm, isLoading = false }) {
    const { t } = useLanguage();

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onClose?.();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose} role="presentation">
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="change-type-modal-title"
            >
                <h3 id="change-type-modal-title" className={styles.title}>
                    {t("sellerOnboarding.changeTypeModal.title")}
                </h3>
                
                <p className={styles.message}>
                    {t("sellerOnboarding.changeTypeModal.message")}
                </p>
                
                <ul className={styles.list}>
                    <li>{t("sellerOnboarding.changeTypeModal.itemAddress")}</li>
                    <li>{t("sellerOnboarding.changeTypeModal.itemBank")}</li>
                    <li>{t("sellerOnboarding.changeTypeModal.itemBusiness")}</li>
                    <li>{t("sellerOnboarding.changeTypeModal.itemDocuments")}</li>
                </ul>
                
                <p className={styles.warningText}>
                    {t("sellerOnboarding.changeTypeModal.warning")}
                </p>
                
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {t("sellerOnboarding.changeTypeModal.btnCancel")}
                    </button>
                    <button
                        type="button"
                        className={styles.confirmBtn}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("sellerOnboarding.changeTypeModal.btnProcessing")
                            : t("sellerOnboarding.changeTypeModal.btnConfirm")}
                    </button>
                </div>
            </div>
        </div>
    );
}
