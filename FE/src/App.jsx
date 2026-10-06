import { ErrorProvider } from '@/shared/context/ErrorContext'
import { AuthProvider } from '@/shared/features/auth/context/AuthContext'
import { CartProvider } from '@/apps/customer/features/cart/context/CartContext'
import { LanguageProvider } from '@/shared/context/LanguageContext'
import AppRoutes from '@/routes/AppRoutes'
import GlobalErrorHandler from '@/shared/components/GlobalErrorHandler'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <GlobalErrorHandler>
              <AppRoutes />
            </GlobalErrorHandler>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorProvider>
  )
}

export default App;
