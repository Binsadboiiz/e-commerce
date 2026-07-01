/**
 * <summary>
 * Root router. Replaces the original AppRoutes.jsx entirely
 * </summary>
 */

import { Routes } from 'react-router-dom'
import PublicRoutes from '@/apps/customer/CustomerRoutes'
import DashboardRoutes from '@/apps/admin/AdminRoutes'
import StandaloneRoutes from './StandaloneRoutes'
import RetailerRoute from '@/apps/seller/SellerRoutes'
import ScrollToTop from '@/shared/components/ScrollToTop'

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {PublicRoutes()}
        {DashboardRoutes()}
        {StandaloneRoutes()}
        {RetailerRoute()}
      </Routes>
    </>
  )
}