import type { Role } from '../auth/types'
import type { DashboardData, PersonalDashboardData, StudentDashboardData } from './types'

async function getDashboard<T extends DashboardData>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'include' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar o dashboard.')
  }

  return (await response.json()) as T
}

export function getPersonalDashboard(): Promise<PersonalDashboardData> {
  return getDashboard<PersonalDashboardData>('/api/dashboard/personal')
}

export function getStudentDashboard(): Promise<StudentDashboardData> {
  return getDashboard<StudentDashboardData>('/api/dashboard/aluno')
}

export function getDashboardForRole(role: Role): Promise<DashboardData> {
  return role === 'personal' ? getPersonalDashboard() : getStudentDashboard()
}
