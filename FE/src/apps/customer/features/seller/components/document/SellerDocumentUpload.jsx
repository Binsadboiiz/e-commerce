import React, { useState } from "react";
import { FiFileText, FiInfo, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import SellerDocumentItem from "./SellerDocumentItem";
import sellerApi from "../../api/sellerApi";
import { notify } from "@/shared/utils/Notify";
import styles from "./SellerDocumentUpload.module.css";

export default function SellerDocumentUpload({
    value = [],
    sellerTypeCode,
    onRefresh,
    onContinue
}) {
    const { t } = useLanguage();
    const [uploadingType, setUploadingType] = useState(null);

    const isBusiness = sellerTypeCode === "BUSINESS";

    const requiredDocs = [
        {
            type: "IDENTITY_FRONT",
            title: t("sellerDocument.idFrontTitle"),
            description: t("sellerDocument.idFrontDesc")
        },
        {
            type: "IDENTITY_BACK",
            title: t("sellerDocument.idBackTitle"),
            description: t("sellerDocument.idBackDesc")
        },
        {
            type: "BUSINESS_LICENSE",
            title: t("sellerDocument.licenseTitle"),
            description: t("sellerDocument.licenseDesc")
        }
    ];

    const requirements = requiredDocs.filter(doc => {
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

            notify.success(t("sellerDocument.uploadSuccess"));
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || t("sellerDocument.uploadError");
            notify.error(msg);
        } finally {
            setUploadingType(null);
        }
    };

    const handleRemove = async (documentId) => {
        try {
            await sellerApi.deleteDocument(documentId);
            notify.success(t("sellerDocument.deleteSuccess"));
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || t("sellerDocument.deleteError");
            notify.error(msg);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.sectionTitleRow}>
                    <h3>{t("sellerDocument.title")}</h3>
                </div>

                <div className={styles.guideBox}>
                    <div className={styles.guideHeader}>
                        <FiInfo className={styles.guideIcon} size={18} />
                        <span>{t("sellerDocument.reqTitle")}</span>
                    </div>
                    <ul className={styles.guideList}>
                        <li>{t("sellerDocument.req1")}</li>
                        <li>{t("sellerDocument.req2")}</li>
                        <li>{t("sellerDocument.req3")}</li>
                    </ul>
                </div>
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
                    <span>{t("common.next")}</span>
                </button>
            </div>
        </div>
    );
}