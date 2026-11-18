import { SELLER_TYPE } from '../constants/sellerType';

export function calculateSellerProgress(registration) {
    if (!registration || !registration.summary) {
        return {
            currentStepIndex: 0, // Type selection
            stepsCount: 5,
            isCompleted: false
        };
    }

    const typeCode = registration.summary.sellerTypeCode;
    const isBusiness = typeCode === SELLER_TYPE.BUSINESS;
    
    const stepsCount = isBusiness ? 6 : 5;

    const hasAddress = !!registration.address;
    const hasBank = !!registration.bank;
    const hasBusiness = isBusiness ? !!registration.business : true;

    const requiredDocTypes = isBusiness
        ? ["IDENTITY_FRONT", "IDENTITY_BACK", "BUSINESS_LICENSE"]
        : ["IDENTITY_FRONT", "IDENTITY_BACK"];

    const hasDocuments = requiredDocTypes.every(type =>
        (registration.documents || []).some(doc => doc.documentType === type)
    );

    let currentStepIndex = 0;

    if (!typeCode) {
        currentStepIndex = 0;
    } else if (!hasAddress) {
        currentStepIndex = 1;
    } else if (!hasBank) {
        currentStepIndex = 2;
    } else if (isBusiness && !registration.business) {
        currentStepIndex = 3;
    } else if (!hasDocuments) {
        currentStepIndex = isBusiness ? 4 : 3;
    } else {
        currentStepIndex = isBusiness ? 5 : 4;
    }

    return {
        currentStepIndex,
        stepsCount,
        isCompleted: hasAddress && hasBank && hasBusiness && hasDocuments
    };
}
