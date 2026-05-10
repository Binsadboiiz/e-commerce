import { ErrorProvider } from './context/ErrorContext'
import { AuthProvider } from './features/auth/context/AuthContext'
import { CartProvider } from './features/cart/context/CartContext'
import AppRoutes from './routes/AppRoutes'
import GlobalErrorHandler from './components/GlobalErrorHandler'

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
