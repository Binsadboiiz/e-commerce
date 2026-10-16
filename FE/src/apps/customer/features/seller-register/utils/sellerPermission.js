import { SELLER_TYPE } from '../constants/sellerType';

export function canSubmitSellerRegistration(registration) {
    if (!registration || !registration.summary) {
        return false;
    }

    const typeCode = registration.summary.sellerTypeCode;
    const isBusiness = typeCode === SELLER_TYPE.BUSINESS;

    const hasAddress = !!registration.address;
    const hasBank = !!registration.bank;
    const hasBusiness = isBusiness ? !!registration.business : true;
    const hasDocuments = registration.documents && registration.documents.length > 0;

    return hasAddress && hasBank && hasBusiness && hasDocuments;
}
