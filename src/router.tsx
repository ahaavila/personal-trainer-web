import { createBrowserRouter, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
])

export default router
