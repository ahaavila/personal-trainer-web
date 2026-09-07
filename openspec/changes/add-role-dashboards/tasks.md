## 1. Dashboard API Client & State

- [ ] 1.1 Define TypeScript response types for personal and aluno dashboard payloads, and verify they model metrics, lists, progress, and weekly series without `any`
- [ ] 1.2 Add role-specific dashboard API functions using `credentials: 'include'`, and verify they call `/api/dashboard/personal` or `/api/dashboard/aluno` according to the authenticated role
- [ ] 1.3 Add loading, retryable error, and empty-data state handling to `DashboardPage`, and verify each state renders without throwing

## 2. Personal Dashboard

- [ ] 2.1 Replace the personal welcome placeholder with the reference-inspired header (localized date, greeting, subtitle, and quick-action links to Exercícios and Clientes), and verify the actions navigate without a full page reload
- [ ] 2.2 Add reusable metric cards for Clientes, Clientes ativos, Exercícios, and Fichas de treino, and verify values come from the API response
- [ ] 2.3 Add the Próximos treinos section with time, client, training context, and status, and verify the empty state when no trainings are returned
- [ ] 2.4 Add the Evolução da semana visualization using accessible CSS bars and weekday labels, and verify zero/empty values render safely
- [ ] 2.5 Verify the personal dashboard matches the supplied dark/gold visual direction at desktop and remains usable at the existing responsive breakpoint

## 3. Aluno Dashboard

- [ ] 3.1 Add the aluno dashboard variant showing the current training plan, next workouts, progress, and weekly activity summary, and verify data is taken from the aluno endpoint
- [ ] 3.2 Add an intentional empty state for an aluno without an active plan, and verify it does not show personal-only metrics or actions
- [ ] 3.3 Verify role switching through the two test credentials renders the correct dashboard variant without stale data from the previous role

## 4. Verification & Documentation

- [ ] 4.1 Run build and lint with the dashboard implementation and verify both pass
- [ ] 4.2 Verify the personal and aluno dashboard flows in the browser against the mock mode contract, including loading, populated, empty, error, and retry states
- [ ] 4.3 Verify the real backend integration against both role-specific endpoints once the backend change is implemented, and document the dashboard response dependency in README.md
