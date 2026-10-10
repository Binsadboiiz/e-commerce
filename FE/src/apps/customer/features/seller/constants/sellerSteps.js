import { SELLER_TYPE } from './sellerType';

export const SELLER_STEPS_PERSONAL = [
    { key: "type", label: "Select Type" },
    { key: "address", label: "Address Info" },
    { key: "bank", label: "Bank Account" },
    { key: "document", label: "Upload Documents" },
    { key: "review", label: "Review & Submit" }
];

export const SELLER_STEPS_BUSINESS = [
    { key: "type", label: "Select Type" },
    { key: "address", label: "Address Info" },
    { key: "bank", label: "Bank Account" },
    { key: "business", label: "Business Info" },
    { key: "document", label: "Upload Documents" },
    { key: "review", label: "Review & Submit" }
];

export function getSellerSteps(typeCode, t) {
    const rawSteps = typeCode === SELLER_TYPE.BUSINESS ? SELLER_STEPS_BUSINESS : SELLER_STEPS_PERSONAL;
    
    if (typeof t === 'function') {
        return rawSteps.map(step => ({
            ...step,
            label: t(`sellerOnboarding.steps.${step.key}`) || step.label
        }));
    }
    
    return rawSteps;
}