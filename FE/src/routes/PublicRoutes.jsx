/**
 * <summary>
 * Public-facing routes, migrated from the <Route element={<MainLayout />}> 
 * </summary>
 */

import { Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import HomePage from '../features/home/Home'
import ProductList from '../features/product/pages/ProductList'
import CartPage from '../features/cart/pages/CartPage'
import CheckoutPage from '../features/checkout/pages/CheckoutPage'
import { ROUTES } from '../config/route.config'

export default function PublicRoutes() {
    return (
        <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductList />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        </Route>
    )
}
