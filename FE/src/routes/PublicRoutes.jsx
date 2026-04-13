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

export default function PublicRoutes() {
    return (
        <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
        </Route>
    )
}
