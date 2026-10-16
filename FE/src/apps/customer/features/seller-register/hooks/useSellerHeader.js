import { useState, useEffect } from 'react';
import { SELLER_HEADER_ACTION } from '../constants/sellerHeaderAction';
import sellerApi from '../api/sellerApi';

export function useSellerHeader() {
    const [action, setAction] = useState(SELLER_HEADER_ACTION.REGISTER);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchHeader = async () => {
            try {
                const response = await sellerApi.getHeader();
                if (isMounted && response?.data) {
                    const headerAction = response.data.headerAction;
                    if (headerAction === "SELLER_CENTER") {
                        setAction(SELLER_HEADER_ACTION.SELLER_CENTER);
                    } else {
                        setAction(SELLER_HEADER_ACTION.REGISTER);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch seller header status", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchHeader();
        return () => {
            isMounted = false;
        };
    }, []);

    return { action, loading };
}