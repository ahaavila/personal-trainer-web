import { useMemo, useState, type ReactNode } from 'react'
import type { AuthUser, AuthContextValue } from './authContextInstance'
import { AuthContext } from './authContextInstance'

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser?: AuthUser | null
}) {
  const [user, setUserState] = useState<AuthUser | null>(initialUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser: (nextUser: AuthUser) => setUserState(nextUser),
      clearUser: () => setUserState(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
