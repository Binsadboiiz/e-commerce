import React, { useState } from "react";
import DocumentViewer from "./DocumentViewer";
import styles from "./ApplicationDetail.module.css";

/**
 * VerificationDocumentsSection Component
 * Displays grid of uploaded verification documents with clickable preview.
 *
 * @param {Object} props
 * @param {Array} props.documents - List of document objects { documentId, documentType, fileUrl }
 */
export default function VerificationDocumentsSection({ documents = [] }) {
    const [previewDoc, setPreviewDoc] = useState(null);

    if (!documents || documents.length === 0) {
        return (
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Verification Documents</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>
                    No verification documents uploaded.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Verification Documents</h3>
            <div className={styles.docGrid}>
                {documents.map((doc) => (
                    <div key={doc.documentId || doc.documentType} className={styles.docItem}>
                        <span className={styles.docType}>{doc.documentType}</span>
                        {doc.fileUrl ? (
                            <div
                                className={styles.docThumbnailWrapper}
                                onClick={() => setPreviewDoc(doc)}
                                title={`Click to view ${doc.documentType}`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setPreviewDoc(doc);
                                    }
                                }}
                            >
                                <img
                                    src={doc.fileUrl}
                                    alt={doc.documentType}
                                    className={styles.docImage}
                                    loading="lazy"
                                />
                                <div className={styles.docOverlay}>
                                    🔍 Preview
                                </div>
                            </div>
                        ) : (
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>No file</span>
                        )}
                    </div>
                ))}
            </div>

            {previewDoc && (
                <DocumentViewer
                    fileUrl={previewDoc.fileUrl}
                    title={previewDoc.documentType}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
        </div>
    );
}
