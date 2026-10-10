import { Route } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';
import { AdminDashboardPage } from '@/apps/admin/features/dashboard/pages/AdminDashboardPage';
import { AdminSellerApplicationsPage } from '@/apps/admin/features/applications/pages/AdminSellerApplicationsPage';
import { AdminRedirectManagerPage } from '@/apps/admin/features/seo/pages/AdminRedirectManagerPage';
import { AdminSettingsPage } from '@/apps/admin/features/settings/pages/AdminSettingsPage';
import DashboardLayout from '@/apps/admin/layouts/DashboardLayout';
import ProtectedRoute from '@/shared/components/ProtectedRoute.jsx';
import { ROLES } from '@/shared/constants/roles';

export default function DashboardRoutes() {
    return (
        <Route element={<DashboardLayout />}>
            <Route 
                path={ROUTES.ADMIN_DASHBOARD} 
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminDashboardPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path={ROUTES.ADMIN_SELLER_APPLICATIONS} 
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminSellerApplicationsPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path={ROUTES.ADMIN_REDIRECTS} 
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminRedirectManagerPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path={ROUTES.ADMIN_SETTINGS} 
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminSettingsPage />
                    </ProtectedRoute>
                } 
            />
        </Route>
    );
}
