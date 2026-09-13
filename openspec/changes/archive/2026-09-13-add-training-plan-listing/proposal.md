## Why

Personal trainers need a centralized view to consult, search, and manage all the training plans (fichas de treino) they have created for their students. Currently, the `/treinos` route displays a placeholder ("Coming Soon"), preventing trainers from reviewing previously prescribed workouts and monitoring student assignments.

## What Changes

- Replace the `/treinos` placeholder route with a complete, personal-only training plans listing page (`TreinosPage`).
- Fetch the list of created training plans from `GET /api/fichas-de-treino`.
- Display training plans with title, associated student name/email, count of workout divisions, total prescribed exercises, validity date range, and status indicator.
- Support real-time search filtering (by plan title and student name) and status filtering (all, active, archived).
- Provide an interactive details modal (`FichaDetailsModal`) to inspect a plan's workout divisions and exercise prescriptions.
- Add editing capabilities within `FichaDetailsModal` allowing the personal to update plan title, notes, dates, status (active/archived), divisions, and exercise prescriptions via `PUT /api/fichas-de-treino/:id`.
- Add deletion capabilities within `FichaDetailsModal` with a confirmation dialog, deleting the plan via `DELETE /api/fichas-de-treino/:id` and updating the list immediately.
- Include a quick-action button ("Nova ficha de treino") linking to `/nova-ficha-de-treino`.
- Provide friendly empty states, loading skeletons, and error retry feedback.
- Update MSW mock handlers in `src/mocks/handlers.ts` to support `GET`, `PUT`, and `DELETE` on `/api/fichas-de-treino`.

## Capabilities

### New Capabilities
- `training-plan-listing`: Personal-facing training plan listing page with search, status filtering, plan details inspection, in-modal editing, and plan deletion.

### Modified Capabilities
<!-- No requirement changes to existing capabilities -->

## Impact

- **Frontend (`personal-trainer-web`)**:
  - Replaces `ComingSoonPage` on route `/treinos` with `TreinosPage`.
  - New components: `TreinosPage.tsx`, `TreinosPage.css`, and plan details inspection view.
  - Consumes `GET /api/fichas-de-treino` via `src/fichas/api.ts`.
  - Updates MSW mock handlers in `src/mocks/handlers.ts`.
- **Backend (`personal-trainer-backend`)**:
  - Requires `GET /api/fichas-de-treino` endpoint returning all training plans authored by the authenticated personal trainer.
