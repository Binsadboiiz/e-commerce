//this's route of Seller
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import ProtectedRoute from "@/shared/components/ProtectedRoute.jsx";
import { ROLES } from "@/shared/constants/roles";
import SellerDashboardSkeleton from "@/apps/seller/features/dashboard/components/SellerDashboardSkeleton";

const DashboardLayout = lazy(() => import("@/apps/seller/layouts/DashboardLayout"));
const SellerDashboard = lazy(() => import("@/apps/seller/features/dashboard/pages/SellerDashboardPage").then(m => ({ default: m.SellerDashboard })));
const SellerProducts = lazy(() => import("@/apps/seller/features/products/pages/SellerProductsPage"));
const SellerVouchersPage = lazy(() => import("@/apps/seller/features/vouchers/pages/SellerVouchersPage"));
const SellerOrdersPage = lazy(() => import("@/apps/seller/features/orders/pages/SellerOrdersPage"));

export default function SellerRoute() {
    return (
        <Route element={
            <Suspense fallback={<SellerDashboardSkeleton />}>
                <DashboardLayout />
            </Suspense>
        }>
            <Route path={ROUTES.SELLER_DASHBOARD} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.SELLER]}>
                    <SellerDashboard />
                </ProtectedRoute>} />

            <Route path={ROUTES.SELLER_PRODUCTS} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.SELLER]}>
                    <SellerProducts />
                </ProtectedRoute>} />

            <Route path={ROUTES.SELLER_VOUCHERS} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.SELLER]}>
                    <SellerVouchersPage />
                </ProtectedRoute>} />

            <Route path={ROUTES.SELLER_ORDERS} 
                element={ <ProtectedRoute allowedRoles = {[ROLES.SELLER]}>
                    <SellerOrdersPage />
                </ProtectedRoute>} />
        </Route>
    )
}