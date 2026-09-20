## 1. Types & Mock API Integration

- [x] 1.1 Add workout execution payload interfaces (`CreateWorkoutExecutionPayload`) in `src/progresso/types.ts` and client function `logWorkoutExecution` in `src/progresso/api.ts`; verify types compile with `npm run build`
- [x] 1.2 Update MSW handlers in `src/mocks/handlers.ts` to allow authenticated students to fetch their assigned training plans via `GET /api/fichas-de-treino` and handle `POST /api/treinos/execucoes`, verifying mock responses

## 2. Interactive Execution Components

- [x] 2.1 Implement `RestTimer.tsx` with preset durations (30s, 60s, 90s, 120s), countdown display, and completion alert; verify timer countdown behavior
- [x] 2.2 Implement `ActiveWorkoutModal.tsx` and `ActiveWorkoutModal.css` with running duration stopwatch (pause/resume), per-set input fields (load kg, reps, completion checkmark), prescribed targets as visual reference, and `localStorage` session persistence; verify input tracking and state restoration
- [x] 2.3 Implement `WorkoutCelebrationModal.tsx` presenting summary statistics (duration, exercises completed, total volume) and return action

## 3. Student Training Hub Page & Routing

- [x] 3.1 Implement `FichaTreinoAlunoPage.tsx` and `FichaTreinoAlunoPage.css` listing assigned plans with status badges, plan division details, and "Iniciar Treino" trigger; verify empty and populated states
- [x] 3.2 Wire `FichaTreinoAlunoPage` into `/ficha-de-treino-atual` in `src/router.tsx` replacing `ComingSoonPage`; verify route access for aluno role
- [x] 3.3 Verify full flow end-to-end: student logs in, navigates to `/ficha-de-treino-atual`, opens routine, starts workout, records sets/reps, uses rest stopwatch, tests reload persistence, concludes workout, and views celebration modal
