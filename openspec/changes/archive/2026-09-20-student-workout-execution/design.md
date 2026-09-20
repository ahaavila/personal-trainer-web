## Context

Currently, the student navigation link for "Ficha de treino" points to `/ficha-de-treino-atual`, which renders a static `ComingSoonPage`. Students lack a dedicated view to see their assigned plans and lack an interactive interface to execute workouts and record their weights and reps. See `proposal.md` for motivation and `specs/student-workout-execution/spec.md` for requirements.

## Goals / Non-Goals

**Goals:**
- Replace `ComingSoonPage` on `/ficha-de-treino-atual` with `FichaTreinoAlunoPage.tsx`.
- Allow students to see all their assigned training plans with status (Ativo / Inativo), validity dates, and divisions count.
- Allow students to inspect a plan's divisions (Treino A, Treino B) and prescribed exercises with target sets, reps, and loads.
- Provide an interactive workout execution view (`ActiveWorkoutModal.tsx`):
  - Live duration stopwatch with pause and resume.
  - Inter-set rest countdown timer with preset durations (30s, 60s, 90s, 120s).
  - Per-set input fields for recorded load (kg) and repetitions performed, displaying prescribed targets as visual reference.
  - Local browser storage persistence (`localStorage`) so in-progress sessions survive page reloads.
  - Conclude workout action with session notes, submitting the session payload to `POST /api/treinos/execucoes`.
  - Celebration modal upon completion with key session highlights (total duration, completed sets, volume).

**Non-Goals:**
- Allowing students to edit the personal trainer's prescribed plan structure.
- Video streaming or live camera workout detection.

## Decisions

### 1. Dedicated Student Training Hub at `/ficha-de-treino-atual`
- **Choice**: Implement `FichaTreinoAlunoPage.tsx` under route `/ficha-de-treino-atual` protected by `RequireRole role="aluno"`.
- **Rationale**: Fulfills the existing route in `ALUNO_MENU_ITEMS` without altering navigation structure.

### 2. Full-Screen Interactive Execution Modal (`ActiveWorkoutModal`)
- **Choice**: When a student clicks "Iniciar Treino", open an interactive execution modal that takes focus, displaying the live stopwatch, inter-set rest timer, and exercise cards.
- **Rationale**: Keeps the student focused during workout execution on mobile and desktop without navigating away from their training hub.

### 3. Real-time Stopwatch and Rest Timer
- **Choice**:
  - Live session timer calculated from `Date.now() - sessionStartTime` with `setInterval(..., 1000)` to prevent background tab drift.
  - Rest timer that counts down from selected preset (30s/60s/90s/120s), with visual pulse/badge indicator when time is up.

### 4. Resilient Session Persistence
- **Choice**: Save active workout state in `localStorage` under `fitforge:active_workout:<email>` on every set input change. On component mount, if a session exists, prompt or automatically restore the in-progress session.
- **Rationale**: Protects students from accidental browser refresh or tab closing in the gym.

### 5. Seamless API & Mock Integration
- **Choice**:
  - `GET /api/fichas-de-treino`: Update MSW handler to return only the authenticated student's assigned training plans when accessed by an aluno.
  - `POST /api/treinos/execucoes`: Submit the completed session payload with `durationMinutes`, `completedAt`, and per-exercise logs.
- **Rationale**: Matches the backend contract already established in `personal-trainer-backend`.

## Risks / Trade-offs

- **[Risk: Browser tab throttle in background slowing down timers]** → *Mitigation*: Store absolute `startTime` timestamp and compute elapsed time using system clock diff rather than incremental counter ticks.
- **[Risk: Student closes workout without completing]** → *Mitigation*: Add confirmation dialog on exit ("Deseja pausar para continuar depois ou descartar o treino?").
