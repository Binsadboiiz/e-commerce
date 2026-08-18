import { useMemo } from "react";
import { useAuth } from "@/shared/features/auth/hooks/useAuth";

/**
 * Helper function to safely decode base64url encoded JWT payload.
 * Returns null if token is missing or invalid.
 */
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

/**
 * Extracts the user identifier from authenticated user context or decoded JWT payload.
 */
function getUserIdFromSources(user, jwtPayload) {
    const candidates = [
        user?.userId,
        user?.id,
        user?.customerId,
        user?.sub,
        jwtPayload?.sub,
        jwtPayload?.nameid,
        jwtPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    ];

    return candidates.find(value => typeof value === "string" && value.trim().length > 0) ?? null;
}

/**
 * React hook to retrieve the current authenticated user's ID for order operations.
 */
export function useOrderUserId() {
    const { user } = useAuth();

    return useMemo(() => {
        const token = localStorage.getItem("token");
        const payload = decodeJwtPayload(token);
        return getUserIdFromSources(user, payload);
    }, [user]);
}
