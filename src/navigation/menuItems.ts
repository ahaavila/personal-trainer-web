export interface MenuItem {
  label: string
  path: string
}

export const PERSONAL_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Exercícios', path: '/exercicios' },
  { label: 'Nova Ficha de Treino', path: '/nova-ficha-de-treino' },
  { label: 'Treinos', path: '/treinos' },
  { label: 'Meu Perfil', path: '/meu-perfil' },
  { label: 'Criar utilizador', path: '/criar-utilizador' },
]

export const ALUNO_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Ficha de Treino Atual', path: '/ficha-de-treino-atual' },
  { label: 'Treinos', path: '/treinos' },
  { label: 'Meu Perfil', path: '/meu-perfil' },
]
