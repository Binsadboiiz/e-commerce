/**
 * Maps seller registration response to frontend model.
 */

export function mapSellerRegistration(data) {
    if (!data) {
        return null;
    }

    return {
        summary: {
            sellerId: data.summary?.sellerId,
            sellerTypeId: data.summary?.sellerTypeId,
            sellerTypeCode: data.summary?.sellerTypeCode,
            sellerStatusId: data.summary?.sellerStatusId,
            sellerStatusCode: data.summary?.sellerStatusCode,
            maxShopLimit: data.summary?.maxShopLimit
        },

        address: data.address
            ? {
                  fullName: data.address.fullName,
                  phoneNumber: data.address.phoneNumber,
                  city: data.address.city,
                  district: data.address.district,
                  ward: data.address.ward,
                  streetAddress: data.address.streetAddress,
                  postalCode: data.address.postalCode,
                  isDefault: data.address.isDefault
              }
            : null,

        bank: data.bank
            ? {
                  bankCode: data.bank.bankCode,
                  accountNumber: data.bank.accountNumber,
                  accountName: data.bank.accountName,
                  isPrimary: data.bank.isPrimary
              }
            : null,

        business: data.business
            ? {
                  companyName: data.business.companyName,
                  taxCode: data.business.taxCode,
                  businessLicenseNumber: data.business.businessLicenseNumber,
                  representative: data.business.representative
              }
            : null,

        documents: (data.documents ?? []).map(document => ({
            documentId: document.documentId,
            documentTypeId: document.documentTypeId,
            documentType: document.documentType,
            fileUrl: document.fileUrl
        })),

        progress: {
            currentStep: data.progress?.currentStep ?? 1,
            completedSteps: data.progress?.completedSteps ?? 0,
            totalSteps: data.progress?.totalSteps ?? 0,
            canSubmit: data.progress?.canSubmit ?? false
        }
    };
}

/**
 * Maps seller header response.
 */

export function mapSellerHeader(data) {
    return {
        isSeller: data?.isSeller ?? false,
        sellerStatusCode: data?.sellerStatusCode,
        headerAction: data?.headerAction ?? "REGISTER"
    };
}