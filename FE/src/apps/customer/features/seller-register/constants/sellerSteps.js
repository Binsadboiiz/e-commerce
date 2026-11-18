import { SELLER_TYPE } from './sellerType';
import { SELLER_STATUS } from '@/shared/constants/sellerStatus';

export const SELLER_REGISTRATION_STEPS_PERSONAL = [
    { key: "type", label: "Select Type" },
    { key: "address", label: "Address Info" },
    { key: "bank", label: "Bank Account" },
    { key: "document", label: "Upload Documents" },
    { key: "review", label: "Review & Submit" }
];

export const SELLER_REGISTRATION_STEPS_BUSINESS = [
    { key: "type", label: "Select Type" },
    { key: "address", label: "Address Info" },
    { key: "bank", label: "Bank Account" },
    { key: "business", label: "Business Info" },
    { key: "document", label: "Upload Documents" },
    { key: "review", label: "Review & Submit" }
];

export const SELLER_STEPS_PERSONAL = SELLER_REGISTRATION_STEPS_PERSONAL;
export const SELLER_STEPS_BUSINESS = SELLER_REGISTRATION_STEPS_BUSINESS;

export function getSellerSteps(typeCode, t) {
    const rawSteps = typeCode === SELLER_TYPE.BUSINESS
        ? SELLER_REGISTRATION_STEPS_BUSINESS
        : SELLER_REGISTRATION_STEPS_PERSONAL;

    if (typeof t === 'function') {
        return rawSteps.map(step => ({
            ...step,
            label: t(`sellerOnboarding.steps.${step.key}`) || step.label
        }));
    }

    return rawSteps;
}

export const SELLER_STATUS_TIMELINE_STEPS = [
    { key: "submitted", label: "Submitted" },
    { key: "review", label: "Under Review" },
    { key: "activate", label: "Activate Shop" }
];

export function getSellerStatusTimeline({ statusCode, hasShop = false, t }) {
    const isApproved = statusCode === SELLER_STATUS.APPROVED;
    const isRejected = statusCode === SELLER_STATUS.REJECTED;

    let secondStepLabel = t ? t("sellerPending.stepReviewing") : "Under Review";
    let secondStepStatus = "active";
    let currentStepIndex = 1;

    if (hasShop || isApproved) {
        secondStepLabel = t ? t("sellerPending.stepApproved") : "Approved";
        secondStepStatus = "completed";
        currentStepIndex = 2;
    } else if (isRejected) {
        secondStepLabel = t ? t("sellerPending.stepRejected") : "Rejected";
        secondStepStatus = "rejected";
        currentStepIndex = 1;
    } else {
        secondStepLabel = t ? t("sellerPending.stepReviewing") : "Under Review";
        secondStepStatus = "active";
        currentStepIndex = 1;
    }

    const thirdStepStatus = hasShop
        ? "completed"
        : isApproved
            ? "active"
            : "pending";

    const steps = [
        {
            key: "submitted",
            label: t ? t("sellerPending.stepSubmitted") : "Submitted",
            status: "completed"
        },
        {
            key: "review",
            label: secondStepLabel,
            status: secondStepStatus
        },
        {
            key: "activate",
            label: t ? t("sellerPending.stepActivate") : "Activate Shop",
            status: thirdStepStatus
        }
    ];

    return {
        steps,
        currentStepIndex
    };
}