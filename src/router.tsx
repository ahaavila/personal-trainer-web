import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from './layouts/AppLayout'
import RequireRole from './auth/RequireRole'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import AlunosPage from './pages/AlunosPage'
import NovoAlunoPage from './pages/NovoAlunoPage'
import ExerciciosPage from './pages/ExerciciosPage'
import NovoExercicioPage from './pages/NovoExercicioPage'
import NovaFichaTreinoPage from './pages/NovaFichaTreinoPage'
import TreinosPage from './pages/TreinosPage'
import EvolucaoPage from './pages/EvolucaoPage'
import MeuPerfilPage from './pages/MeuPerfilPage'
import FichaTreinoAlunoPage from './pages/FichaTreinoAlunoPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/esqueci-minha-senha', element: <ForgotPasswordPage /> },
  { path: '/redefinir-senha', element: <ResetPasswordPage /> },
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
        element: <RequireRole role="personal"><NovoExercicioPage /></RequireRole>,
      },
      {
        path: '/nova-ficha-de-treino',
        element: <RequireRole role="personal"><NovaFichaTreinoPage /></RequireRole>,
      },
      {
        path: '/treinos',
        element: <RequireRole role="personal"><TreinosPage /></RequireRole>,
      },
      {
        path: '/evolucao',
        element: <RequireRole role="personal"><EvolucaoPage /></RequireRole>,
      },
      { path: '/meu-perfil', element: <MeuPerfilPage /> },
      {
        path: '/criar-utilizador',
        element: <RequireRole role="personal"><NovoAlunoPage /></RequireRole>,
      },
      {
        path: '/ficha-de-treino-atual',
        element: <RequireRole role="aluno"><FichaTreinoAlunoPage /></RequireRole>,
      },
    ],
  },
])

export default router
