import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import type { Role } from './types'
import { useAuth } from './useAuth'
import AccessDeniedPage from '../pages/AccessDeniedPage'

interface RequireRoleProps {
  role: Role
  children: ReactNode
}

function RequireRole({ role, children }: RequireRoleProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <AccessDeniedPage />
  }

  return children
}

export default RequireRole
