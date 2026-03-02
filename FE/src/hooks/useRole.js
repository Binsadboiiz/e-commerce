import { useAuth } from "./useAuth";

export const useRole = () => {
    const { user } = useAuth();

    const hasRole = (roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    return { hasRole };
};