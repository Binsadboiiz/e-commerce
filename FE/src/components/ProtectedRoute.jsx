import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useRole } from "../hooks/useRole";

const ProtectedRoute = ({ children, allowedRoles}) => {
    const { loading } = useAuth();
    const { hasRole } = useRole();

    if (loading) return <div>Loading...</div>

    if (!hasRole(allowedRoles))
        return <Navigate to="/unauthorized" replace />;

    return children;
};

export default ProtectedRoute;