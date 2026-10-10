//this's route of Seller
import { Route } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { SellerDashboard } from "@/apps/seller/features/dashboard/pages/SellerDashboardPage";
import SellerProducts from "@/apps/seller/features/products/pages/SellerProductsPage";
import SellerVouchersPage from "@/apps/seller/features/vouchers/pages/SellerVouchersPage";
import SellerOrdersPage from "@/apps/seller/features/orders/pages/SellerOrdersPage";
import SellerShopSetupPage from "@/apps/seller/features/store/pages/SellerShopSetupPage";
import DashboardLayout from "@/apps/seller/layouts/DashboardLayout";
import ProtectedRoute from "@/shared/components/ProtectedRoute.jsx";
import { ROLES } from "@/shared/constants/roles";

import SellerRegistrationLayout from "@/apps/customer/layouts/SellerRegistrationLayout";

export default function SellerRoute() {
    return (
        <>
            <Route element={<SellerRegistrationLayout />}>
                <Route 
                    path={ROUTES.SELLER_SETUP_SHOP} 
                    element={ 
                        <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
                            <SellerShopSetupPage />
                        </ProtectedRoute>
                    } 
                />
            </Route>

            <Route element={<DashboardLayout />}>
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
        </>
    );
}