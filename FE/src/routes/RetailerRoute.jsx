//this's route of Retailer
import { Route } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { RetailerDashboard } from "@/features/retailer/pages/RetailerDashboard";
import RetailerProducts from "@/features/retailer/pages/RetailerProducts";
import { RetailerDashboardLayout } from "@/features/retailer/components/DashboardLayout";
import  ProtectedRoute  from '../components/ProtectedRoute.jsx';
import { ROLES } from "../constants/roles";

export default function RetailerRoute() {
    return (
        <Route element={<RetailerDashboardLayout />}>
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