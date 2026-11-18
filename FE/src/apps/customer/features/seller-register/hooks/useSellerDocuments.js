import { useState } from 'react';
import sellerApi from '../api/sellerApi';

export function useSellerDocuments(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadDocument = async (documentTypeId, fileUrl) => {
        try {
            setLoading(true);
            setError(null);
            await sellerApi.uploadDocument({ documentTypeId, fileUrl });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload document");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (documentId) => {
        try {
            setLoading(true);
            setError(null);
            await sellerApi.deleteDocument(documentId);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete document");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadDocument,
        deleteDocument,
        loading,
        error
    };
}