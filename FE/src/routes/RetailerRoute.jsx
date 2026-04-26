//this's route of Retailer
import { Route } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { RetailerDashboard } from "@/features/retailer/pages/RetailerDashboard";
import RetailerProducts from "@/features/retailer/pages/RetailerProducts";
import { RetailerDashboardLayout } from "@/features/retailer/components/DashboardLayout";

export default function RetailerRoute() {
    return (
        <Route element={<RetailerDashboardLayout />}>
            <Route path={ROUTES.RETAILER_DASHBOARD} element={<RetailerDashboard />} />
            <Route path={ROUTES.RETAILER_PRODUCTS} element={<RetailerProducts />} />
        </Route>
    )
}