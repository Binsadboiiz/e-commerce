import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import useSellerRegistration from "../hooks/useSellerRegistration";
import { calculateSellerProgress } from "../utils/sellerProgress";
import { getSellerSteps } from "../constants/sellerSteps";
import { notify } from "@/shared/utils/Notify";
import SEOHead from "@/shared/components/SEOHead";
import { ROUTES } from "@/config/route.config";
import styles from "./SellerRegistrationPage.module.css";

import SellerStepper from "../components/common/SellerStepper";
import SellerTypeSelector from "../components/type/SellerTypeSelector";
import SellerChangeTypeModal from "../components/type/SellerChangeTypeModal";
import SellerAddressForm from "../components/address/SellerAddressForm";
import SellerBankForm from "../components/bank/SellerBankForm";
import SellerBusinessForm from "../components/business/SellerBusinessForm";
import SellerDocumentUpload from "../components/document/SellerDocumentUpload";
import SellerReview from "../components/review/SellerReview";
import SellerPendingPage from "./SellerPendingPage";

import { useLanguage } from "@/shared/context/LanguageContext";

/**
 * Main Onboarding Page for Seller Registration.
 * Guides prospective sellers through account type selection, address setup, bank account input,
 * optional business information, document uploading, and final submission for admin approval.
 */
export default function SellerRegistrationPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const {
        registration,
        loading,
        createRegistration,
        updateRegistration,
        submitRegistration,
        changeSellerType,
        reload
    } = useSellerRegistration();

    //Calculate active progress step from submitted API profile data
    const { currentStepIndex } = calculateSellerProgress(registration);
    const [userSelectedStepIndex, setUserSelectedStepIndex] = useState(null);
    const [pendingChangeTypeId, setPendingChangeTypeId] = useState(null);

    const hasShop = Boolean(registration?.summary?.hasShop);

    useEffect(() => {
        if (hasShop) {
            navigate(ROUTES.SELLER_DASHBOARD || '/seller/dashboard', { replace: true });
        }
    }, [hasShop, navigate]);

    const activeStepIndex = userSelectedStepIndex !== null ? userSelectedStepIndex : currentStepIndex;

    //Render loading spinner while fetching registration status
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <div className={styles.loadingText}>
                    {t("common.loading")}
                </div>
            </div>
        );
    }

    //Check if application has already been submitted for review
    const statusCode = registration?.summary?.sellerStatusCode;
    const isSubmitted = statusCode === "PENDING" || statusCode === "UNDER_REVIEW" || statusCode === "APPROVED" || statusCode === "REJECTED";

    //If application is submitted, approved, or rejected, redirect view to the SellerPendingPage status tracker
    if (isSubmitted) {
        return (
            <div className={styles.container}>
                <SellerPendingPage
                    registration={registration}
                    onReEdit={() => setUserSelectedStepIndex(0)}
                />
            </div>
        );
    }

    const typeCode = registration?.summary?.sellerTypeCode;
    const steps = getSellerSteps(typeCode, t);

    const handleStepSubmit = async (payload) => {
        try {
            await updateRegistration(payload);
            setUserSelectedStepIndex(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTypeSelect = async (typeId) => {
        try {
            await createRegistration({ sellerTypeId: typeId });
            setUserSelectedStepIndex(null);
            notify.success("Đã chọn loại hình gian hàng thành công.");
        } catch (error) {
            console.error(error);
            const msg = error?.response?.data?.message || "Không thể khởi tạo đăng ký gian hàng. Vui lòng thử lại.";
            notify.error(msg);
        }
    };

    const handleDocumentStepContinue = () => {
        const isBusiness = typeCode === "BUSINESS";
        const requiredTypes = isBusiness
            ? ["IDENTITY_FRONT", "IDENTITY_BACK", "BUSINESS_LICENSE"]
            : ["IDENTITY_FRONT", "IDENTITY_BACK"];

        const hasAllDocs = requiredTypes.every(type =>
            (registration?.documents || []).some(doc => doc.documentType === type)
        );

        if (!hasAllDocs) {
            notify.error("Vui lòng tải lên đầy đủ các chứng từ xác minh bắt buộc.");
            return;
        }

        setUserSelectedStepIndex(null);
    };

    const handleChangeSellerType = (typeId) => {
        setPendingChangeTypeId(typeId);
    };

    const handleConfirmChangeSellerType = async () => {
        if (pendingChangeTypeId === null) return;

        const typeId = pendingChangeTypeId;
        setPendingChangeTypeId(null);

        try {
            await changeSellerType(typeId);
            setUserSelectedStepIndex(null);
            notify.success("Đã thay đổi loại hình gian hàng thành công.");
        } catch (error) {
            console.error(error);
            const msg = error?.response?.data?.message || "Không thể thay đổi loại hình gian hàng.";
            notify.error(msg);
        }
    };

    const renderStepContent = () => {
        if (!registration?.summary) {
            return (
                <SellerTypeSelector
                    onCreate={handleTypeSelect}
                />
            );
        }

        const stepKey = steps[activeStepIndex]?.key;

        switch (stepKey) {
            case "type":
                return (
                    <SellerTypeSelector
                        value={registration.summary.sellerTypeId}
                        code={registration.summary.sellerTypeCode}
                        sellerStatus={registration.summary.sellerStatusCode}
                        onCreate={handleTypeSelect}
                        onChangeType={handleChangeSellerType}
                    />
                );

            case "address":
                return (
                    <SellerAddressForm
                        initialValues={registration.address}
                        onSubmit={(value) =>
                            handleStepSubmit({
                                address: value
                            })
                        }
                    />
                );

            case "bank":
                return (
                    <SellerBankForm
                        initialValues={
                            registration.bank
                                ? {
                                    bankName: registration.bank.bankCode,
                                    accountNumber: registration.bank.accountNumber,
                                    accountName: registration.bank.accountName
                                }
                                : null
                        }
                        onSubmit={(value) =>
                            handleStepSubmit({
                                bank: {
                                    bankCode: value.bankName,
                                    accountNumber: value.accountNumber,
                                    accountName: value.accountName,
                                    isPrimary: true
                                }
                            })
                        }
                    />
                );

            case "business":
                return (
                    <SellerBusinessForm
                        initialValues={registration.business}
                        onSubmit={(value) =>
                            handleStepSubmit({
                                business: {
                                    companyName: value.companyName,
                                    taxCode: value.taxCode,
                                    businessLicenseNumber: value.businessLicenseNumber,
                                    representative: value.representative
                                }
                            })
                        }
                    />
                );

            case "document":
                return (
                    <SellerDocumentUpload
                        value={registration.documents}
                        sellerTypeCode={typeCode}
                        onRefresh={reload}
                        onContinue={handleDocumentStepContinue}
                    />
                );

            case "review":
                return (
                    <SellerReview
                        registration={registration}
                        onSubmit={submitRegistration}
                        onEditStep={(stepIdx) => setUserSelectedStepIndex(stepIdx)}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <SEOHead
                title="Đăng Ký Bán Hàng Cùng PolarisX Mall"
                description="Mở gian hàng kinh doanh miễn phí tại PolarisX Mall, tiếp cận hàng triệu khách hàng tiềm năng."
            />

            {/* Hero Header Section */}
            <div className={styles.heroSection}>
                <h1 className={styles.title}>{t("sellerOnboarding.title")}</h1>
                <p className={styles.subtitle}>
                    {t("sellerOnboarding.subtitle")}
                </p>
                <div className={styles.stepProgressBadge}>
                    {t("sellerOnboarding.stepBadge", { current: activeStepIndex + 1, total: steps.length, label: steps[activeStepIndex]?.label })}
                </div>
            </div>

            {/* Step Progress Stepper */}
            <SellerStepper
                steps={steps}
                currentStepIndex={activeStepIndex}
                maxAccessibleStepIndex={currentStepIndex}
                onStepClick={(index) => setUserSelectedStepIndex(index)}
            />

            {/* Main Form Card Container */}
            <div className={styles.card}>
                {renderStepContent()}
            </div>

            {/* Change Type Confirmation Modal */}
            <SellerChangeTypeModal
                isOpen={pendingChangeTypeId !== null}
                onClose={() => setPendingChangeTypeId(null)}
                onConfirm={handleConfirmChangeSellerType}
            />
        </div>
    );
}
