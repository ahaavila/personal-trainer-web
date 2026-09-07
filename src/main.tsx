import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './router.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'
import { getSession } from './auth/api.ts'

async function enableMocking() {
  if (!import.meta.env.DEV) return
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'true') return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking()
  .then(() => getSession())
  .then((user) => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <AuthProvider initialUser={user}>
          <RouterProvider router={router} />
        </AuthProvider>
      </StrictMode>,
    )
  })

