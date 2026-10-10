import React, { useRef } from "react";
import { FiFileText, FiTrash2, FiUploadCloud, FiEye, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerDocumentItem.module.css";

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
        <div className={`${styles.item} ${uploadedDoc ? styles.itemUploaded : ''}`}>
            <div className={styles.left}>
                <div className={`${styles.icon} ${uploadedDoc ? styles.iconSuccess : ''}`}>
                    {uploadedDoc ? <FiCheckCircle size={20} /> : <FiFileText size={20} />}
                </div>

                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <span className={styles.name}>{requirement.title}</span>
                        {uploadedDoc ? (
                            <span className={styles.badgeSuccess}>{t("sellerDocument.uploaded")}</span>
                        ) : (
                            <span className={styles.badgePending}>{t("sellerDocument.notUploaded")}</span>
                        )}
                    </div>

                    <div className={styles.description}>
                        {requirement.description}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                {isUploading ? (
                    <div className={styles.loadingWrapper}>
                        <div className={styles.miniSpinner}></div>
                        <span className={styles.loadingText}>{t("sellerDocument.uploading")}</span>
                    </div>
                ) : uploadedDoc ? (
                    <div className={styles.uploadedActions}>
                        <a 
                            href={uploadedDoc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.viewLink}
                        >
                            <FiEye size={15} />
                            <span>{t("sellerDocument.viewFile")}</span>
                        </a>

                        {!disabled && (
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={onRemove}
                                title={t("sellerDocument.delete")}
                            >
                                <FiTrash2 size={15} />
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
                            />
                            <button
                                type="button"
                                className={styles.uploadButton}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FiUploadCloud size={16} />
                                <span>{t("sellerDocument.upload")}</span>
                            </button>
                        </>
                    )
                )}
            </div>
        </div>
    );
}