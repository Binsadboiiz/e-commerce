/**
 * <summary>
 * Routes that render without any layout shell — auth pages and error page.
 * </summary>
 */

import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { ROUTES } from '@/config/route.config'
import PageSkeleton from '@/shared/components/ui/PageSkeleton'

const ErrorPage = lazy(() => import('../pages/error/ErrorPage'))
const RegisterPage = lazy(() => import("@/shared/features/auth/pages/RegisterPage"))
const LoginPage = lazy(() => import("@/shared/features/auth/pages/LoginPage"))

export default function StandaloneRoutes() {
    return (
        <>
            <Route path={ROUTES.LOGIN} element={
                <Suspense fallback={<PageSkeleton />}>
                    <LoginPage />
                </Suspense>
            } />
            <Route path={ROUTES.REGISTER} element={
                <Suspense fallback={<PageSkeleton />}>
                    <RegisterPage />
                </Suspense>
            } />
            <Route path={ROUTES.ERROR} element={
                <Suspense fallback={<PageSkeleton />}>
                    <ErrorPage />
                </Suspense>
            } />
            <Route path="*" element={
                <Suspense fallback={<PageSkeleton />}>
                    <ErrorPage />
                </Suspense>
            } />
        </>
    )
}
