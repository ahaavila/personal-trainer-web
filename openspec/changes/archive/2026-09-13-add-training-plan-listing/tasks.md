## 1. Domain & API Integration

- [x] 1.1 Verify and enhance `src/fichas/types.ts` and `src/fichas/api.ts` for listing training plans with full nested division and exercise fields, and verify type check passes.
- [x] 1.2 Ensure MSW handler in `src/mocks/handlers.ts` for `GET /api/fichas-de-treino` returns mock training plans with division and exercise details.
- [x] 1.3 Add `updateTrainingPlan` (`PUT /api/fichas-de-treino/:id`) and `deleteTrainingPlan` (`DELETE /api/fichas-de-treino/:id`) in `src/fichas/api.ts` and MSW handlers in `src/mocks/handlers.ts`.

## 2. UI Components & Plan Inspection, Edit, and Delete

- [x] 2.1 Implement `src/fichas/FichaDetailsModal.tsx` and `FichaDetailsModal.css` displaying the full plan hierarchy (divisions, exercise parameters, sets, reps, rest, load, and notes).
- [x] 2.2 Add edit mode to `FichaDetailsModal` allowing the personal to edit title, notes, dates, status, divisions, and exercise prescription rows with validation and submit to `PUT /api/fichas-de-treino/:id`.
- [x] 2.3 Add deletion action with confirmation prompt to `FichaDetailsModal` invoking `DELETE /api/fichas-de-treino/:id` and updating the list.
- [x] 2.4 Create `src/pages/TreinosPage.tsx` and `TreinosPage.css` with header, search input, status filter, card grid layout, empty states, loading skeletons, and error retry feedback.

## 3. Routing & Integration Verification

- [x] 3.1 Update `src/router.tsx` to mount `TreinosPage` protected by `RequireRole role="personal"` on `/treinos`.
- [x] 3.2 Verify role-based access control and complete end-to-end user experience (browsing plans, real-time search, status filtering, inspecting plan details, editing plan, deleting plan, and creating new plans).
