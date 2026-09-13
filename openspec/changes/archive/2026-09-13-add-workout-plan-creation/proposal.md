## Why

Personal trainers need a dedicated and efficient way to create structured training plans (fichas de treino) for their students directly within the platform. Currently, the "Nova Ficha de Treino" menu item points to a placeholder, preventing personals from prescribing workouts, organizing exercise divisions (e.g. Treino A/B/C), and assigning them to specific students.

## What Changes

- Replace the `/nova-ficha-de-treino` placeholder route in this frontend repository with a complete, personal-only workout plan creation page.
- Allow personal trainers to select a student from their roster (`GET /api/alunos`) and define general plan details (title, notes/instructions, validity/dates).
- Support creating one or multiple workout routines/divisions (e.g., Treino A, Treino B, Treino C) within the plan.
- Allow adding exercises from the personal's exercise library (`GET /api/exercicios`) into each division with custom prescription parameters (sets, reps, rest interval, target load, and technical notes).
- Allow reordering and removing exercises within a division, as well as adding/removing divisions.
- Validate all required fields (student selection, plan title, at least one workout division, and at least one exercise per division with valid sets/reps) before submission.
- Submit the complete workout sheet via `POST /api/fichas-de-treino` with session cookie credentials.
- Handle loading states, server validation errors, and provide seamless redirection (e.g., to `/treinos`) upon successful creation.
- Implement full MSW mock endpoints in `src/mocks/handlers.ts` for frontend development and local testing.
- Define the external API contract (`POST /api/fichas-de-treino`) consumed by the frontend and to be implemented in the backend repository (`personal-trainer-backend`).

## Capabilities

### New Capabilities
- `workout-plan-creation`: Personal-only page and flow to create and assign structured workout plans (with divisions and exercise prescriptions) to students.

### Modified Capabilities
<!-- No requirement changes to existing capabilities -->

## Impact

- **Frontend (`personal-trainer-web` - this workspace)**:
  - Replaces `ComingSoonPage` on route `/nova-ficha-de-treino` with `NovaFichaTreinoPage`.
  - New module `src/fichas/` with TypeScript types, API client, and state management.
  - Integration with existing `alunos` and `exercicios` APIs for selection dropdowns/pickers.
  - Updates MSW mock handlers in `src/mocks/handlers.ts` to simulate `POST /api/fichas-de-treino` and store mock plans in memory during development.
- **Backend (`personal-trainer-backend` - separate repository)**:
  - Requires the implementation of `POST /api/fichas-de-treino` and associated relational models (`TrainingPlan`, `WorkoutDivision`, `WorkoutExercise`) in the backend repository.
