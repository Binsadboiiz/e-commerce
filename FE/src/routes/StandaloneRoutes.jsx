/**
 * <summary>
 * Routes that render without any layout shell — auth pages and error page.
 * </summary>
 */

import { Route } from 'react-router-dom'
import ErrorPage from '../pages/error/ErrorPage'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

export default function StandaloneRoutes() {
    return (
        <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
        </>
    )
}
