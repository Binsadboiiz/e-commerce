//this's route of Retailer
import { Route } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { RetailerDashboard } from "@/apps/seller/features/dashboard/pages/RetailerDashboardPage";
import RetailerProducts from "@/apps/seller/features/products/pages/RetailerProductsPage";
import DashboardLayout from "@/apps/seller/layouts/DashboardLayout";
import ProtectedRoute from "@/shared/components/ProtectedRoute.jsx";
import { ROLES } from "@/shared/constants/roles";

export default function RetailerRoute() {
    return (
        <Route element={<DashboardLayout />}>
            <Route path={ROUTES.RETAILER_DASHBOARD} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.RETAILER]}>
                    <RetailerDashboard />
                </ProtectedRoute>} />

            <Route path={ROUTES.RETAILER_PRODUCTS} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.RETAILER]}>
                    <RetailerProducts />
                </ProtectedRoute>} />
        </Route>
    )
}