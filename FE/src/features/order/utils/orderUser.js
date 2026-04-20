import { useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";

function decodeJwtPayload(token) {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];
        if (!payload) {
            return null;
        }

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(normalized);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

function getUserIdFromSources(user, jwtPayload) {
    const candidates = [
        user?.id,
        user?.userId,
        user?.customerId,
        user?.sub,
        jwtPayload?.sub,
        jwtPayload?.nameid,
        jwtPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    ];

    return candidates.find(value => typeof value === "string" && value.trim().length > 0) ?? null;
}

export function useOrderUserId() {
    const { user } = useAuth();

    return useMemo(() => {
        const token = localStorage.getItem("token");
        const payload = decodeJwtPayload(token);
        return getUserIdFromSources(user, payload);
    }, [user]);
}
