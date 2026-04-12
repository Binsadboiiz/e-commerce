import { ErrorProvider } from './context/ErrorContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './features/cart/context/CartContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ErrorProvider>
  )
}

console.log(import.meta.env.VITE_API_BASE_URL);

export default App;
