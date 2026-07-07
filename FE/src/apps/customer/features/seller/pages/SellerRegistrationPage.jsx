import React, { useState, useEffect } from "react";
import useSellerRegistration from "../hooks/useSellerRegistration";
import { calculateSellerProgress } from "../utils/sellerProgress";
import { getSellerSteps } from "../constants/sellerSteps";
import { notify } from "@/shared/utils/Notify";
import styles from "./SellerRegistrationPage.module.css";

import SellerStepper from "../components/common/SellerStepper";
import SellerTypeSelector from "../components/type/SellerTypeSelector";
import SellerAddressForm from "../components/address/SellerAddressForm";
import SellerBankForm from "../components/bank/SellerBankForm";
import SellerBusinessForm from "../components/business/SellerBusinessForm";
import SellerDocumentUpload from "../components/document/SellerDocumentUpload";
import SellerReview from "../components/review/SellerReview";

export default function SellerRegistrationPage() {
    const {
        registration,
        loading,
        createRegistration,
        updateRegistration,
        submitRegistration,
        reload
    } = useSellerRegistration();

    const { currentStepIndex } = calculateSellerProgress(registration);
    const [userSelectedStepIndex, setUserSelectedStepIndex] = useState(null);

    const activeStepIndex = userSelectedStepIndex !== null ? userSelectedStepIndex : currentStepIndex;

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <div className={styles.loadingText}>
                    Loading registration details...
                </div>
            </div>
        );
    }

    const typeCode = registration?.summary?.sellerTypeCode;
    const steps = getSellerSteps(typeCode);

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
        } catch (error) {
            console.error(error);
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
            notify.error("Please upload all required verification documents.");
            return;
        }

        setUserSelectedStepIndex(null);
    };

    const renderStepContent = () => {
        if (!registration?.summary) {
            return (
                <SellerTypeSelector
                    onChange={handleTypeSelect}
                />
            );
        }

        const stepKey = steps[activeStepIndex]?.key;

        switch (stepKey) {
            case "type":
                return (
                    <SellerTypeSelector
                        value={registration.summary.sellerTypeId}
                        onChange={handleTypeSelect}
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
                                    representative: value.representativeName
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
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                Seller Registration
            </h2>

            <SellerStepper
                steps={steps}
                currentStepIndex={activeStepIndex}
                maxAccessibleStepIndex={currentStepIndex}
                onStepClick={(index) => setUserSelectedStepIndex(index)}
            />

            <div className={styles.card}>
                {renderStepContent()}
            </div>
        </div>
    );
}