/**
 * <summary>
 * Root router. Replaces the original AppRoutes.jsx entirely
 * </summary>
 */

import { Routes } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import DashboardRoutes from './DashboardRoutes'
import StandaloneRoutes from './StandaloneRoutes'
import RetailerRoute from './RetailerRoute'
export default function AppRouter() {
  return (
    <Routes>
      {PublicRoutes()}
      {DashboardRoutes()}
      {StandaloneRoutes()}
      {RetailerRoute()}
    </Routes>
  )
}