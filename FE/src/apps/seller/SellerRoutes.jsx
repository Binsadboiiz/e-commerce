//this's route of Seller
import { Route } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { SellerDashboard } from "@/apps/seller/features/dashboard/pages/SellerDashboardPage";
import SellerProducts from "@/apps/seller/features/products/pages/SellerProductsPage";
import DashboardLayout from "@/apps/seller/layouts/DashboardLayout";
import ProtectedRoute from "@/shared/components/ProtectedRoute.jsx";
import { ROLES } from "@/shared/constants/roles";

export default function SellerRoute() {
    return (
        <Route element={<DashboardLayout />}>
            <Route path={ROUTES.SELLER_DASHBOARD} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.SELLER]}>
                    <SellerDashboard />
                </ProtectedRoute>} />

            <Route path={ROUTES.SELLER_PRODUCTS} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.SELLER]}>
                    <SellerProducts />
                </ProtectedRoute>} />
        </Route>
    )
}