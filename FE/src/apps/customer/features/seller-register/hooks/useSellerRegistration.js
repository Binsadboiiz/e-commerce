import { useCallback, useEffect, useState } from "react";
import sellerApi from "../api/sellerApi";
import { mapSellerRegistration } from "../services/sellerMapper";

export default function useSellerRegistration(options = {}) {
    const { enabled = true } = options;
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(enabled);

    const loadRegistration = useCallback(async function () {
        if (!enabled) return;

        try {
            setLoading(true);

            const response = await sellerApi.getRegistration();

            setRegistration(
                mapSellerRegistration(response.data)
            );
        } finally {
            setLoading(false);
        }
    }, [enabled]);

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

    const changeSellerType = async function (sellerTypeId) {
        await sellerApi.updateSellerType({
            sellerTypeId
        });

        await loadRegistration();
    }

    useEffect(function () {
        if (enabled) {
            loadRegistration();
        } else {
            setLoading(false);
        }
    }, [enabled, loadRegistration]);

    return {
        registration,
        loading,

        reload: loadRegistration,

        createRegistration,
        updateRegistration,
        submitRegistration,
        changeSellerType
    };
}