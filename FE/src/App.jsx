import { ErrorProvider } from '@/shared/context/ErrorContext'
import { AuthProvider } from '@/shared/features/auth/context/AuthContext'
import { CartProvider } from '@/apps/customer/features/cart/context/CartContext'
import AppRoutes from '@/routes/AppRoutes'
import GlobalErrorHandler from '@/shared/components/GlobalErrorHandler'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <CartProvider>
          <GlobalErrorHandler>
            <AppRoutes />
          </GlobalErrorHandler>
        </CartProvider>
      </AuthProvider>
    </ErrorProvider>
  )
}

export default App;
