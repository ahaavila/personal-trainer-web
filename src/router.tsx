import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from './layouts/AppLayout'
import RequireRole from './auth/RequireRole'
import ComingSoonPage from './pages/ComingSoonPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AlunosPage from './pages/AlunosPage'
import NovoAlunoPage from './pages/NovoAlunoPage'
import ExerciciosPage from './pages/ExerciciosPage'

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
      {
        path: '/exercicios',
        element: <RequireRole role="personal"><ExerciciosPage /></RequireRole>,
      },
      {
        path: '/novo-exercicio',
        element: <RequireRole role="personal"><ComingSoonPage title="Novo exercício" /></RequireRole>,
      },
      {
        path: '/nova-ficha-de-treino',
        element: <ComingSoonPage title="Nova Ficha de Treino" />,
      },
      { path: '/treinos', element: <ComingSoonPage title="Treinos" /> },
      { path: '/meu-perfil', element: <ComingSoonPage title="Meu Perfil" /> },
      {
        path: '/criar-utilizador',
        element: <RequireRole role="personal"><NovoAlunoPage /></RequireRole>,
      },
      {
        path: '/ficha-de-treino-atual',
        element: <ComingSoonPage title="Ficha de Treino Atual" />,
      },
    ],
  },
])

export default router
