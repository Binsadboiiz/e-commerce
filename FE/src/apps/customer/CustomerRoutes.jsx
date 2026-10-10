/**
 * <summary>
 * Public-facing routes, migrated from the <Route element={<MainLayout />}> 
 * </summary>
 */

import { Route } from 'react-router-dom'
import { ROUTES } from '@/config/route.config'
import { lazy, Suspense } from 'react'

import MainLayout from '@/apps/customer/layouts/MainLayout'
import SellerRegistrationLayout from '@/apps/customer/layouts/SellerRegistrationLayout'
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { ROLES } from '@/shared/constants/roles';
import PageSkeleton from '@/shared/components/ui/PageSkeleton';

const HomePage = lazy (() => import('@/apps/customer/features/home/Home'));
const ProductList = lazy(() => import('@/apps/customer/features/product/pages/ProductList'));
const ProductDetailPage = lazy(() => import('@/apps/customer/features/product/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/apps/customer/features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/apps/customer/features/checkout/pages/CheckoutPage'));
const MyOrdersPage = lazy(() => import('@/apps/customer/features/order/pages/MyOrdersPage'));
const OrderTrackingPage = lazy(() => import('@/apps/customer/features/order/pages/OrderTrackingPage'));
const ProfilePage = lazy(() => import('@/shared/features/auth/pages/ProfilePage'));
const SellerRegistrationPage = lazy(() => import('@/apps/customer/features/seller').then(m => ({ default: m.SellerRegistrationPage })));

export default function PublicRoutes() {
    return (
        <>
            <Route element={
                <Suspense fallback={<PageSkeleton />}>
                    <MainLayout />
                </Suspense>
            }>
                <Route index element={<HomePage />} />
                <Route path={ROUTES.PRODUCTS_LIST} element={<ProductList />} />
                <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />

                <Route path={ROUTES.CART} 
                    element={ <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                        <CartPage />
                </ProtectedRoute>} />

                <Route path={ROUTES.CHECKOUT} 
                    element={ <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                        <CheckoutPage />
                    </ProtectedRoute>} />

                <Route path={ROUTES.MY_ORDERS} 
                    element={ <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                    <MyOrdersPage />
                </ProtectedRoute>} />

                <Route path={ROUTES.ORDER_TRACKING} 
                    element={ <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                    <OrderTrackingPage />
                </ProtectedRoute>} />
                
                <Route path={ROUTES.PROFILE} 
                    element={ <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SELLER]}>
                    <ProfilePage />
                </ProtectedRoute>} />
            </Route>

            <Route element={
                <Suspense fallback={<PageSkeleton />}>
                    <SellerRegistrationLayout />
                </Suspense>
            }>
                <Route path={ROUTES.SELLER_REGISTRATION} element={<SellerRegistrationPage />} />
            </Route>
        </>
    )
}
