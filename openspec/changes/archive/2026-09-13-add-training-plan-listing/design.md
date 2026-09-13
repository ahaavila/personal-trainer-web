## Context

Personal trainers can create customized workout plans via `/nova-ficha-de-treino`. However, the `/treinos` route is currently an unbuilt placeholder (`ComingSoonPage`). Personal trainers need a dedicated page to browse, search, and inspect the details of all created training plans.

### Repository Scope
- **Frontend (`personal-trainer-web` - this workspace)**: Implements `TreinosPage` at `/treinos`, card layout, search and filtering, plan details inspection modal, routing, and MSW handlers.
- **Backend (`personal-trainer-backend` - separate repository)**: Implements `GET /api/fichas-de-treino` with personal ownership filtering, student relation resolution, and workout divisions/exercises inclusion.

## Goals / Non-Goals

**Goals:**
- Replace `ComingSoonPage` on `/treinos` with `TreinosPage` guarded by `RequireRole role="personal"`.
- Fetch training plans list from `GET /api/fichas-de-treino`.
- Render a responsive grid of training plan cards with title, student info, division count, total exercise count, date range, and status badge.
- Implement client-side search (by plan title and student name) and status filter (Todos, Ativos, Arquivados).
- Build an interactive `FichaDetailsModal` allowing:
  - Reading the full routine breakdown (divisions, exercises, sets, reps, rest, load, notes).
  - Editing the training plan in place (changing title, notes, dates, status, divisions, prescriptions) with `PUT /api/fichas-de-treino/:id`.
  - Deleting the training plan with a confirmation dialog via `DELETE /api/fichas-de-treino/:id`.
- Add a prominent "Nova ficha de treino" action button linking directly to `/nova-ficha-de-treino`.
- Handle loading skeletons, error with retry button, and empty states.

**Non-Goals:**
- Student workout logging/check-in tracking.
- PDF generation/export.

## Decisions

### 1. Page Layout & Card Component Architecture

- **`TreinosPage.tsx`**:
  - Header with title ("Fichas de Treino"), subtitle, and "+ Nova Ficha" action button.
  - Filter bar: search input with icon + status dropdown (`all`, `active`, `archived`).
  - Grid of `TrainingPlanCard` elements displaying:
    - Plan title and status badge (`Ativo`, `Arquivado`, `Rascunho`).
    - Student avatar/initials, student name, and student objective badge.
    - Metric chips: Number of workout divisions (e.g. "3 divisões") and total exercises (e.g. "14 exercícios").
    - Creation date and validity range (if set).
    - "Ver detalhes" button to trigger `FichaDetailsModal`.

- **`FichaDetailsModal.tsx`**:
  - Modal overlay supporting:
    - **View Mode**: Displays the full hierarchy of divisions, exercises, sets, reps, rest, load, and notes. Includes "Editar ficha" and "Excluir ficha" action buttons.
    - **Edit Mode**: Allows updating title, notes, dates, status, and editing/adding/removing division items and exercise parameters directly.
    - **Delete Confirmation**: Shows a confirmation warning before issuing `DELETE /api/fichas-de-treino/:id`.

### 2. State Management & API Integration

- Extend `src/fichas/api.ts` with `updateTrainingPlan(id, input)` (`PUT /api/fichas-de-treino/:id`) and `deleteTrainingPlan(id)` (`DELETE /api/fichas-de-treino/:id`).
- When a plan is updated or deleted, update the list state in `TreinosPage` immediately and show a notification banner.

### 3. MSW Parity

- Ensure `GET /api/fichas-de-treino` in `src/mocks/handlers.ts` returns the in-memory `TRAINING_PLANS` populated with complete division and exercise details.

## Risks / Trade-offs

- **[Risk] High density of information in plan cards**
  -> *Mitigation*: Display clean summary metrics on cards and delegate detailed division/exercise inspection to `FichaDetailsModal`.
- **[Risk] Multiple plans per student**
  -> *Mitigation*: Group/filter clearly by student name, and display active status prominently.
