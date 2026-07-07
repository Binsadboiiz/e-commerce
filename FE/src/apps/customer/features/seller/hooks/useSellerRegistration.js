import { useCallback, useEffect, useState } from "react";
import sellerApi from "../api/sellerApi";
import { mapSellerRegistration } from "../services/sellerMapper";

export default function useSellerRegistration() {
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadRegistration = useCallback(async function () {
        try {
            setLoading(true);

            const response = await sellerApi.getRegistration();

            setRegistration(
                mapSellerRegistration(response.data)
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const createRegistration = async function (payload) {
        await sellerApi.createRegistration(payload);

        await loadRegistration();
    };

    const updateRegistration = async function (payload) {
        await sellerApi.updateRegistration(payload);

        await loadRegistration();
    };

    const submitRegistration = async function () {
        await sellerApi.submitRegistration();

        await loadRegistration();
    };

    useEffect(function () {
        loadRegistration();
    }, [loadRegistration]);

    return {
        registration,
        loading,

        reload: loadRegistration,

        createRegistration,
        updateRegistration,
        submitRegistration
    };
}