## Why

Personal trainers need to monitor and assess how their students are performing over time. Currently, trainers can only view high-level student details and latest workout dates, without any dedicated screen to analyze workout completion history, progressive overload (weights lifted), or repetition progress across exercises.

## What Changes

- Add a new "Evolução dos Alunos" page (`/evolucao`) accessible to personal trainers via the side navigation menu.
- Support selecting any student via a prominent dropdown/search selector on `/evolucao`, with direct deep-linking support (`/evolucao?alunoId=:id` or `/evolucao/:id`).
- Add an action link/button in the alunos listing table (`/alunos`) to navigate directly to that student's progress page.
- Provide a dual-tab interface for the selected student:
  - **Aba 1 (Histórico de Treinos)**: Chronological timeline of executed workouts with date, workout title, duration, and exercise breakdown (sets, reps, max load, and notes).
  - **Aba 2 (Evolução por Exercício)**: Exercise selector, metric summary cards (current max load, total gain, session count), interactive SVG line chart showing load progression over time, and comparative history table displaying set/rep details and load differences (`+X kg`).
- Add mock data and MSW endpoints to supply workout logs and exercise evolution series for test students.

## Capabilities

### New Capabilities
- `student-progress`: Provides student selection, workout session history timeline, and exercise progressive overload tracking with metrics, SVG charts, and comparison tables.

### Modified Capabilities
- `app-navigation`: Updates the personal trainer side navigation menu to include "Evolução dos Alunos" linking to `/evolucao`.

## Impact

- **Routing & Navigation**: Adds `/evolucao` route in `src/router.tsx` protected for `personal` role; adds menu item in `src/navigation/menuItems.ts`.
- **UI Components & Pages**: Creates `src/pages/EvolucaoPage.tsx` and `src/pages/EvolucaoPage.css`, along with progress components/types; updates `src/pages/AlunosPage.tsx` with direct "Ver Evolução" link.
- **API & Mocking**: Adds client API functions in `src/alunos/` or `src/progresso/` and MSW handlers in `src/mocks/handlers.ts` to simulate workout session logs and exercise progress.
