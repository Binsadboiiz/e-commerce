import { BrowserRouter } from 'react-router-dom'
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

export default App
