import { ErrorProvider } from './context/ErrorContext'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorProvider>
  )

}

console.log(import.meta.env.VITE_API_BASE_URL);

export default App;
