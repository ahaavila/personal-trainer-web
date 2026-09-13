## 1. API Client & Mock Handlers

- [x] 1.1 Add `updateExercise(id, input)` and `deleteExercise(id)` functions to `src/exercicios/api.ts` with typed error handling and credentials.
- [x] 1.2 Update MSW handlers in `src/mocks/handlers.ts` to support `PUT /api/exercicios/:id` and `DELETE /api/exercicios/:id`.

## 2. Interactive UI & Exercise Management Modal

- [x] 2.1 Make exercise cards in `ExerciciosPage.tsx` clickable with hover styling and accessible keyboard navigation to open the exercise details/edit modal.
- [x] 2.2 Build the exercise edit modal component allowing editing of name, muscle group, equipment, level, description, default sets, and default reps.
- [x] 2.3 Implement the delete exercise flow with a confirmation modal/dialog and destructive styling.
- [x] 2.4 Refresh the exercise library list automatically after a successful update or deletion, displaying feedback toasts/status messages.

## 3. Verification

- [x] 3.1 Verify opening an exercise, editing fields, saving changes, and observing the updated card in the library in mock mode.
- [x] 3.2 Verify canceling and confirming exercise deletion, ensuring removed exercises disappear from the library.
- [x] 3.3 Run `npm run build` and `npm run lint` to verify frontend passes all checks.
