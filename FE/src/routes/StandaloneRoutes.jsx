/**
 * <summary>
 * Routes that render without any layout shell — auth pages and error page.
 * </summary>
 */

import { Route } from 'react-router-dom'
import { ROUTES } from '@/config/route.config'

import ErrorPage from '../pages/error/ErrorPage'
import RegisterPage from "@/shared/features/auth/pages/RegisterPage";
import LoginPage from "@/shared/features/auth/pages/LoginPage";


export default function StandaloneRoutes() {
    return (
        <>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.ERROR} element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
        </>
    )
}
