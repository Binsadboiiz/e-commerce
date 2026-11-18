import React, { useRef } from "react";
import { FiFileText, FiTrash2, FiUploadCloud } from "react-icons/fi";
import styles from "./SellerDocumentItem.module.css";

export default function SellerDocumentItem({
    requirement,
    uploadedDoc,
    isUploading,
    onUpload,
    onRemove,
    disabled = false
}) {
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
                <div className={styles.icon}>
                    <FiFileText size={22} />
                </div>

                <div className={styles.info}>
                    <div className={styles.name}>
                        {requirement.title}
                    </div>

                    <div className={styles.type}>
                        {uploadedDoc ? (
                            <a 
                                href={uploadedDoc.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.viewLink}
                            >
                                View uploaded file
                            </a>
                        ) : (
                            requirement.description
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                {isUploading ? (
                    <span className={styles.loadingText}>Uploading...</span>
                ) : uploadedDoc ? (
                    !disabled && (
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={onRemove}
                        >
                            <FiTrash2 />
                            Remove
                        </button>
                    )
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
                                Upload
                            </button>
                        </>
                    )
                )}
            </div>
        </div>
    );
}