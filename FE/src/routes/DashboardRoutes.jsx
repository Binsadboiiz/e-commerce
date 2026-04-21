/**
 * <summary>
 * Dashboard routes, migrated from the <Route element={<DashboardLayout />}> 
 * </summary>
 */

import { Route } from 'react-router-dom'
import DashboardLayout from '../components/layout/dashboard/DashboardLayout'


export default function DashboardRoutes() {
    return (
        <Route path="/dashboard" element={<DashboardLayout />}>
        </Route>
    )
}