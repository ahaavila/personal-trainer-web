## 1. Domain Types and API Client

- [x] 1.1 Create `src/fichas/types.ts` defining TypeScript interfaces for training plans, workout divisions, workout exercises, form values, and API request/response payloads, and verify type checking passes with `tsc --noEmit`.
- [x] 1.2 Implement `src/fichas/api.ts` with `createTrainingPlan` using `fetch` with credentials and structured error handling, and verify the client function handles success and failure responses.
- [x] 1.3 Ensure API contract definitions in `src/fichas/types.ts` strictly match the backend contract specified for `personal-trainer-backend`.

## 2. Mock Service Worker (MSW) & Parity

- [x] 2.1 Implement mock handler in `src/mocks/handlers.ts` for `POST /api/fichas-de-treino` that validates payload structure (student, title, divisions, exercises), stores mock plans in memory, and returns 201 Created with metadata.
- [x] 2.2 Add mock validation error responses (400 Bad Request for missing student or empty divisions) in MSW and verify with test requests.

## 3. UI Components & Workout Plan Builder

- [x] 3.1 Implement an `ExercisePickerModal` component (and stylesheet) that fetches and filters exercises from `GET /api/exercicios` and allows the personal to select an exercise with default sets and reps.
- [x] 3.2 Create `src/pages/NovaFichaTreinoPage.tsx` and `NovaFichaTreinoPage.css` with student selection dropdown (populated from `GET /api/alunos`), plan title, observation notes, and optional validity dates.
- [x] 3.3 Build the interactive multi-division workout builder within `NovaFichaTreinoPage` supporting adding/removing divisions (Treino A, B, C...) and adding/editing/removing exercise prescription rows (sets, reps, rest interval, target load, notes).
- [x] 3.4 Implement client-side form validation (required student, title, at least one division with at least one exercise, positive sets, non-empty reps), error highlights, loading indicator during submission, and server error banner.

## 4. Routing, Navigation & End-to-End Verification

- [x] 4.1 Update `src/router.tsx` to mount `NovaFichaTreinoPage` protected by `RequireRole role="personal"` at `/nova-ficha-de-treino`.
- [x] 4.2 Verify role-based access: personal trainer can access the form, while unauthenticated users and alunos are redirected.
- [x] 4.3 Verify complete end-to-end workout plan creation: selecting student, adding divisions and exercises, submitting the form, receiving success feedback, and navigating to the target page.
