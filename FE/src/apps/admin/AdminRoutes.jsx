import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';
import ProtectedRoute from '@/shared/components/ProtectedRoute.jsx';
import { ROLES } from '@/shared/constants/roles';
import AdminDashboardSkeleton from '@/apps/admin/features/dashboard/components/AdminDashboardSkeleton';

const DashboardLayout = lazy(() => import('@/apps/admin/layouts/DashboardLayout'));
const AdminDashboardPage = lazy(() => import('@/apps/admin/features/dashboard/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminSellerApplicationsPage = lazy(() => import('@/apps/admin/features/applications/pages/AdminSellerApplicationsPage').then(m => ({ default: m.AdminSellerApplicationsPage })));
const AdminRedirectManagerPage = lazy(() => import('@/apps/admin/features/seo/pages/AdminRedirectManagerPage').then(m => ({ default: m.AdminRedirectManagerPage })));
const AdminSettingsPage = lazy(() => import('@/apps/admin/features/settings/pages/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

export default function DashboardRoutes() {
    return (
        <Route element={
            <Suspense fallback={<AdminDashboardSkeleton />}>
                <DashboardLayout />
            </Suspense>
        }>
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
