import { createContext } from 'react'
import type { Role } from './types'

export interface AuthUser {
  role: Role
  name: string
}

export interface AuthContextValue {
  user: AuthUser | null
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
