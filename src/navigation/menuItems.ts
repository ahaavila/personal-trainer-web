import type { LucideIcon } from 'lucide-react'
import {
  ClipboardList,
  Dumbbell,
  FilePlus2,
  Grid2X2,
  History,
  PersonStanding,
  UserPlus,
  Users,
} from 'lucide-react'

export interface MenuItem {
  label: string
  path: string
  icon: LucideIcon
}

export const PERSONAL_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: Grid2X2 },
  { label: 'Alunos', path: '/alunos', icon: Users },
  { label: 'Exercícios', path: '/exercicios', icon: Dumbbell },
  { label: 'Nova Ficha de Treino', path: '/nova-ficha-de-treino', icon: FilePlus2 },
  { label: 'Treinos', path: '/treinos', icon: History },
  { label: 'Meu Perfil', path: '/meu-perfil', icon: PersonStanding },
  { label: 'Criar utilizador', path: '/criar-utilizador', icon: UserPlus },
]

export const ALUNO_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: Grid2X2 },
  { label: 'Ficha de treino', path: '/ficha-de-treino-atual', icon: ClipboardList },
  { label: 'Treinos', path: '/treinos', icon: History },
  { label: 'Meu perfil', path: '/meu-perfil', icon: PersonStanding },
]
