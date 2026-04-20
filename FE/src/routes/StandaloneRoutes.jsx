/**
 * <summary>
 * Routes that render without any layout shell — auth pages and error page.
 * </summary>
 */

import { Route } from 'react-router-dom'
import { ROUTES } from '../config/route.config'

import ErrorPage from '../pages/error/ErrorPage'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

export default function StandaloneRoutes() {
    return (
        <>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.ERROR} element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
        </>
    )
}
