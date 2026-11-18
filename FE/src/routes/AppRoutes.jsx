/**
 * <summary>
 * Root router. Replaces the original AppRoutes.jsx entirely
 * </summary>
 */

import { Suspense } from 'react'
import { Routes } from 'react-router-dom'
import PublicRoutes from '@/apps/customer/CustomerRoutes'
import DashboardRoutes from '@/apps/admin/AdminRoutes'
import StandaloneRoutes from './StandaloneRoutes'
import SellerRoute from '@/apps/seller/SellerRoutes'
import ScrollToTop from '@/shared/components/ScrollToTop'
import PageSkeleton from '@/shared/components/ui/PageSkeleton'

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {PublicRoutes()}
          {DashboardRoutes()}
          {StandaloneRoutes()}
          {SellerRoute()}
        </Routes>
      </Suspense>
    </>
  )
}