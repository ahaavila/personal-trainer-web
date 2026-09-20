## 1. Types & Mock API Layer

- [x] 1.1 Define student progress, workout session log, and exercise evolution interfaces in `src/progresso/types.ts` and verify types compile with `npm run build`
- [x] 1.2 Implement `getStudentProgress(alunoId: number)` client API function in `src/progresso/api.ts` and verify function exports
- [x] 1.3 Add MSW mock handlers for `GET /api/alunos/:id/progresso` in `src/mocks/handlers.ts` with workout sessions and exercise progression datasets for demo students, verifying API responses

## 2. Navigation & Components

- [x] 2.1 Update `PERSONAL_MENU_ITEMS` in `src/navigation/menuItems.ts` to include "Evolução dos Alunos" with route `/evolucao` and `TrendingUp` icon; verify menu rendering
- [x] 2.2 Add "Ver Evolução" action in `src/pages/AlunosPage.tsx` navigating to `/evolucao?alunoId=:id` and update table headers/cells; verify click navigation
- [x] 2.3 Implement native SVG line chart component `src/progresso/LoadProgressionChart.tsx` with responsive layout, data points, tooltips, and axis labels

## 3. Progress Hub Page & Verification

- [x] 3.1 Implement `EvolucaoPage.tsx` and `EvolucaoPage.css` supporting student selection dropdown, URL search param synchronization (`?alunoId=`), and the two tabs (Histórico de Treinos e Evolução por Exercício); verify tab switching and empty states
- [x] 3.2 Register `/evolucao` route in `src/router.tsx` protected by `RequireRole role="personal"`; verify route access
- [x] 3.3 Verify full flow end-to-end: navigate via menu lateral to `/evolucao`, select a student, inspect workout session timeline, switch to exercise evolution tab, filter by exercise, verify SVG chart and metrics, and test deep link from `/alunos`
