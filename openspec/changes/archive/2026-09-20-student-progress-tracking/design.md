## Context

Personal trainers need a single hub to inspect student training progression. See `proposal.md` for motivation and `specs/student-progress/spec.md` for functional requirements.

## Goals / Non-Goals

**Goals:**
- Provide a dedicated route `/evolucao` with `RequireRole role="personal"`.
- Support selecting an aluno via dropdown or through query string parameter `?alunoId=:id`.
- Add "Evolução dos Alunos" to `PERSONAL_MENU_ITEMS` in `src/navigation/menuItems.ts` (using Lucide icon `TrendingUp`).
- Add a direct "Ver Evolução" link/button in the alunos table on `AlunosPage.tsx`.
- Implement two core tabs for the selected student:
  1. **Histórico de Treinos**: Chronological timeline showing date/time, workout division title, duration, and exercise details (sets, reps, max load).
  2. **Evolução por Exercício**: Exercise selector, summary cards (Max load, delta, session count), pure SVG line chart plotting load progression over time with data points, and comparative history table with `+X kg` difference indicators.
- Create mock data structures in MSW (`src/mocks/handlers.ts`) simulating workout history and exercise sets for demo students.

**Non-Goals:**
- Allowing personal trainers to edit historical student logs in this change.
- Real-time live session streaming.

## Decisions

### 1. URL State Management (`/evolucao?alunoId=:id`)
- **Choice**: Store selected student ID in the URL search params (`useSearchParams`).
- **Rationale**: Enables bookmarking, browser back/forward buttons, and clean deep linking from the Alunos page table row.

### 2. Native SVG Line Chart without External Chart Libraries
- **Choice**: Build a lightweight, custom React SVG line chart component (`LoadProgressionChart.tsx`).
- **Rationale**: Keeps bundle size minimal, zero external charting dependencies, full control over theme styling matching FitForge dark/gold colors, and avoids compatibility issues with React 19.

### 3. Data Structure & Mock Endpoints
- **Choice**:
  - `GET /api/alunos/:id/progresso`: Returns student summary info, workout session timeline (`workoutLogs`), and grouped exercise progression history (`exerciseProgress`).
- **Rationale**: Allows fetching the entire progress dataset in a single roundtrip when an aluno is selected.

## Risks / Trade-offs

- **[Risk: Student with zero logged workouts]** → *Mitigation*: Graceful empty state illustration in both tabs explaining that the student has not completed any workouts yet.
- **[Risk: Single session for an exercise]** → *Mitigation*: Chart and table gracefully handle $N=1$ sessions without division by zero or NaN percent variations.
