import React, { useRef } from "react";
import { FiFileText, FiTrash2, FiUploadCloud, FiEye, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerDocumentItem.module.css";

/**
 * SellerDocumentItem Component
 * Minimal, clean, production-quality document row.
 * Eliminates aggressive card backgrounds and prominent colored borders in favor of
 * a clean white layout, subtle dividers, compact icons, and restrained actions.
 */
export default function SellerDocumentItem({
    requirement,
    uploadedDoc,
    isUploading,
    onUpload,
    onRemove,
    disabled = false
}) {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className={styles.item}>
            <div className={styles.left}>
                <div
                    className={`${styles.icon} ${uploadedDoc ? styles.iconUploaded : ''}`}
                    aria-hidden="true"
                >
                    {uploadedDoc ? <FiCheckCircle size={18} /> : <FiFileText size={18} />}
                </div>

                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <span className={styles.name}>{requirement.title}</span>
                        {uploadedDoc && (
                            <span className={styles.statusSuccess}>
                                <FiCheckCircle size={12} aria-hidden="true" />
                                <span>{t("sellerDocument.uploaded")}</span>
                            </span>
                        )}
                    </div>

                    <div className={styles.description}>
                        {requirement.description}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                {isUploading ? (
                    <div className={styles.loadingWrapper} role="status" aria-live="polite">
                        <div className={styles.miniSpinner} aria-hidden="true"></div>
                        <span className={styles.loadingText}>{t("sellerDocument.uploading")}</span>
                    </div>
                ) : uploadedDoc ? (
                    <div className={styles.uploadedActions}>
                        <a 
                            href={uploadedDoc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.actionView}
                            aria-label={`${t("sellerDocument.viewFile")}: ${requirement.title}`}
                        >
                            <FiEye size={14} aria-hidden="true" />
                            <span>{t("sellerDocument.viewFile")}</span>
                        </a>

                        {!disabled && (
                            <button
                                type="button"
                                className={styles.actionDelete}
                                onClick={onRemove}
                                aria-label={`${t("sellerDocument.delete")}: ${requirement.title}`}
                            >
                                <FiTrash2 size={14} aria-hidden="true" />
                                <span>{t("sellerDocument.delete")}</span>
                            </button>
                        )}
                    </div>
                ) : (
                    !disabled && (
                        <>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                aria-label={`Upload ${requirement.title}`}
                            />
                            <button
                                type="button"
                                className={styles.uploadButton}
                                onClick={() => fileInputRef.current?.click()}
                                aria-label={`${t("sellerDocument.upload")}: ${requirement.title}`}
                            >
                                <FiUploadCloud size={14} aria-hidden="true" />
                                <span>{t("sellerDocument.upload")}</span>
                            </button>
                        </>
                    )
                )}
            </div>
        </div>
    );
}