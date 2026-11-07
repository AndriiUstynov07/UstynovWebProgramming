import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/auth.js'

// Якщо користувач не увійшов - відправляємо на /login
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
