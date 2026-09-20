## Why

Students currently have no functional interface to access their training routines or execute their workouts in real time, encountering a placeholder page on `/ficha-de-treino-atual`. A complete student workout execution experience allows students to view their assigned training plans (active and past), start an interactive workout session with a live timer, record actual loads and repetitions performed per set (referencing prescribed targets), utilize an inter-set rest stopwatch, and conclude the workout to feed their progression history.

## What Changes

- Replace `ComingSoonPage` on `/ficha-de-treino-atual` with a dedicated student training hub (`FichaTreinoAlunoPage.tsx`).
- Display all training plans assigned to the authenticated student, indicating their status (Ativo / Arquivado), validity period, and divisions (Treino A, B...).
- Provide a detailed inspection view for training plans, showing all divisions and prescribed exercises with sets, target reps, rest interval, and notes.
- Add an interactive workout execution screen/modal when the student clicks "Iniciar Treino":
  - Active session timer tracking elapsed workout duration.
  - Quick rest timer between sets (e.g. 30s, 60s, 90s) with countdown.
  - Per-set input fields for recorded load (kg) and repetitions performed, displaying the personal trainer's prescribed prescription as visual reference.
  - Local browser persistence (`localStorage`) so an accidental page refresh does not lose an ongoing workout session.
  - "Finalizar Treino" action prompting for optional session notes, calculating total duration, and submitting the workout log to `POST /api/treinos/execucoes`.
  - Celebration modal upon completion summarizing workout time, exercises completed, and total volume.
- Add API client functions in `src/fichas/api.ts` and `src/progresso/api.ts`, and wire MSW mock handlers for student workout plan retrieval and session execution logging.

## Capabilities

### New Capabilities
- `student-workout-execution`: Covers student training plan browsing, plan inspection, active workout session tracking with live duration timer, per-set load and repetition recording, rest timer, session persistence, and completion logging.

### Modified Capabilities
<!-- None: existing app navigation already links to /ficha-de-treino-atual -->

## Impact

- **Routing**: Replaces `ComingSoonPage` on `/ficha-de-treino-atual` in `src/router.tsx` with `FichaTreinoAlunoPage.tsx`.
- **UI Components & Pages**: Creates `FichaTreinoAlunoPage.tsx`, `FichaTreinoAlunoPage.css`, `ActiveWorkoutModal.tsx`, `ActiveWorkoutModal.css`, and `RestTimer.tsx`.
- **API & Mocking**: Adds client functions for student plan retrieval and workout logging, updating `src/mocks/handlers.ts` to allow student role access to assigned plans and execution logging.
