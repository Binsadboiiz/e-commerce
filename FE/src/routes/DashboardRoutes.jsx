/**
 * <summary>
 * Dashboard routes, migrated from the <Route element={<DashboardLayout />}> 
 * </summary>
 */

import { Route } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';

import DashboardLayout from '@/components/layout/dashboard/DashboardLayout'

// import DashboardPage from '@/features/dashboard/pages/DashboardPage'

export default function DashboardRoutes() {
    return (
        <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
            {/* <Route index element={<DashboardPage />} /> */}
        </Route>
    )
}