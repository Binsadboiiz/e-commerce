import React, { useState } from "react";
import SellerDocumentItem from "./SellerDocumentItem";
import sellerApi from "../../api/sellerApi";
import { notify } from "@/shared/utils/Notify";
import styles from "./SellerDocumentUpload.module.css";

const REQUIRED_DOCUMENTS = [
    {
        type: "IDENTITY_FRONT",
        title: "Identity Card (Front)",
        description: "Upload the front side of your identity card."
    },
    {
        type: "IDENTITY_BACK",
        title: "Identity Card (Back)",
        description: "Upload the back side of your identity card."
    },
    {
        type: "BUSINESS_LICENSE",
        title: "Business License",
        description: "Required for Business Seller only."
    }
];

export default function SellerDocumentUpload({
    value = [],
    sellerTypeCode,
    onRefresh,
    onContinue
}) {
    const [uploadingType, setUploadingType] = useState(null);

    const isBusiness = sellerTypeCode === "BUSINESS";

    const requirements = REQUIRED_DOCUMENTS.filter(doc => {
        if (doc.type === "BUSINESS_LICENSE" && !isBusiness) {
            return false;
        }
        return true;
    });

    const MAP_TYPE_TO_ID = {
        "IDENTITY_FRONT": 1,
        "IDENTITY_BACK": 2,
        "SELFIE": 3,
        "BUSINESS_LICENSE": 4
    };

    const handleUpload = async (type, file) => {
        const documentTypeId = MAP_TYPE_TO_ID[type];
        if (!documentTypeId) return;

        try {
            setUploadingType(type);

            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await sellerApi.uploadImage(formData);
            const fileUrl = uploadRes.url;

            await sellerApi.uploadDocument({
                documentTypeId,
                fileUrl
            });

            notify.success(`Uploaded ${type.replace('_', ' ').toLowerCase()} successfully`);
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to upload document";
            notify.error(msg);
        } finally {
            setUploadingType(null);
        }
    };

    const handleRemove = async (documentId) => {
        try {
            await sellerApi.deleteDocument(documentId);
            notify.success("Document removed successfully");
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to delete document";
            notify.error(msg);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3>Verification Documents</h3>

                <p>
                    Upload clear images of the required verification
                    documents before submitting your application.
                </p>
            </div>

            <div className={styles.list}>
                {requirements.map(req => {
                    const uploadedDoc = value.find(
                        item => item.documentType === req.type
                    );
                    return (
                        <SellerDocumentItem
                            key={req.type}
                            requirement={req}
                            uploadedDoc={uploadedDoc}
                            isUploading={uploadingType === req.type}
                            onUpload={(file) => handleUpload(req.type, file)}
                            onRemove={() => uploadedDoc && handleRemove(uploadedDoc.documentId)}
                        />
                    );
                })}
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={onContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}