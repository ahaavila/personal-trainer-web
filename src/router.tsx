import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from './layouts/AppLayout'
import RequireRole from './auth/RequireRole'
import ComingSoonPage from './pages/ComingSoonPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AlunosPage from './pages/AlunosPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/clientes', element: <Navigate to="/alunos" replace /> },
      {
        path: '/alunos',
        element: <RequireRole role="personal"><AlunosPage /></RequireRole>,
      },
      { path: '/exercicios', element: <ComingSoonPage title="Exercícios" /> },
      {
        path: '/nova-ficha-de-treino',
        element: <ComingSoonPage title="Nova Ficha de Treino" />,
      },
      { path: '/treinos', element: <ComingSoonPage title="Treinos" /> },
      { path: '/meu-perfil', element: <ComingSoonPage title="Meu Perfil" /> },
      {
        path: '/criar-utilizador',
        element: <ComingSoonPage title="Criar utilizador" />,
      },
      {
        path: '/ficha-de-treino-atual',
        element: <ComingSoonPage title="Ficha de Treino Atual" />,
      },
    ],
  },
])

export default router
