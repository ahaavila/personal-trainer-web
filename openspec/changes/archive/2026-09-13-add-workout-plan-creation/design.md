## Context

The application allows personal trainers to manage their students and exercises. However, the workout plan creation workflow (`/nova-ficha-de-treino`) is currently a placeholder. Personal trainers need a dedicated interface to prescribe structured workout routines with multiple divisions (e.g., Treino A, Treino B) and tailored exercise prescriptions (sets, reps, rest interval, target load, notes) for a chosen student.

### Repository Boundaries
- **Frontend (`personal-trainer-web` - this workspace)**: Implements the React UI, form state management, validation, client API module, routing, and MSW mock handlers for local development.
- **Backend (`personal-trainer-backend` - separate repository)**: Receives the contract definition and will implement the relational persistence, controllers, validation rules, and authorization.

## Goals / Non-Goals

**Goals (Frontend - `personal-trainer-web`):**
- Build `NovaFichaTreinoPage` at `/nova-ficha-de-treino` protected by `RequireRole role="personal"`.
- Fetch personal's students (`GET /api/alunos`) and exercise library (`GET /api/exercicios`) for dropdowns/modals.
- Provide an interactive workout builder allowing creation of multiple named divisions (Treino A, B, C...) and exercise rows.
- Pre-fill default sets and reps when an exercise is picked from the library.
- Implement full client-side validation for required fields, positive sets, valid reps, and non-empty divisions.
- Submit the payload to `POST /api/fichas-de-treino` and provide feedback/navigation upon success.
- Add MSW handlers for mock development and testing in this repository.

**Contract Definition (for `personal-trainer-backend`):**
- Define relational entities: `TrainingPlan`, `WorkoutDivision`, and `WorkoutExercise`.
- Define `POST /api/fichas-de-treino` API contract, validation schema, and transaction flow.
- Define multi-tenant security rules (ensuring personal can only prescribe to their own students and reference accessible exercises).

**Non-Goals:**
- Direct backend code modifications within this workspace (all backend code lives in `personal-trainer-backend`).
- Student workout execution logging and live timer (tracked in separate student workout execution capability).
- Exporting plans to PDF / spreadsheet (future feature).
- Exercise creation inline inside the sheet builder (exercises are picked from the existing exercise library).

## Decisions

### 1. Relational Data Model (Backend)

The backend schema organizes training plans in a 3-level hierarchy:

```
[User: Personal] ---> [TrainingPlan] ---> [WorkoutDivision] ---> [WorkoutExercise] ---> [Exercise]
                            |
                     [User: Student]
```

- **`TrainingPlan` (`FichaDeTreino`)**:
  - `id`: UUID / primary key
  - `personalId`: FK -> User (role: personal)
  - `studentId`: FK -> User (role: aluno)
  - `title`: string (e.g. "Hipertrofia - Fase 1")
  - `notes`: text / nullable (general instructions, frequency, warm-up advice)
  - `startDate`: date / nullable
  - `endDate`: date / nullable
  - `status`: enum (`active`, `archived`, `draft`)
  - `createdAt`, `updatedAt`: timestamps

- **`WorkoutDivision` (`DivisaoTreino`)**:
  - `id`: UUID / primary key
  - `trainingPlanId`: FK -> `TrainingPlan` (on delete cascade)
  - `name`: string (e.g. "Treino A - Peito e Tríceps")
  - `order`: integer (1, 2, 3...)
  - `notes`: text / nullable
  - `createdAt`, `updatedAt`: timestamps

- **`WorkoutExercise` (`ExercicioTreino`)**:
  - `id`: UUID / primary key
  - `workoutDivisionId`: FK -> `WorkoutDivision` (on delete cascade)
  - `exerciseId`: FK -> `Exercise` (reference to library item)
  - `order`: integer (sequence index in the routine)
  - `sets`: integer (> 0)
  - `reps`: string (e.g. "8 a 10", "12", "Falha")
  - `restInterval`: string / nullable (e.g. "60s", "90s")
  - `targetLoad`: string / nullable (e.g. "20kg", "Progredir carga")
  - `notes`: text / nullable (e.g. "Drop-set na última série", "Cadência 3010")
  - `createdAt`, `updatedAt`: timestamps

*Alternatives considered*: Storing divisions and exercises as a raw JSON blob in `TrainingPlan.data`.
*Rationale for relational*: Structured relational entities enable easy querying, progress tracking, analytics, exercise usage metrics, and referential integrity across the system.

---

### 2. API Contract & Transactional Creation (`POST /api/fichas-de-treino`)

- **Method**: `POST`
- **Path**: `/api/fichas-de-treino` (or `/api/training-plans`)
- **Authentication**: Session cookie (requires authenticated personal)
- **Request Body**:
  ```json
  {
    "studentId": "uuid-or-student-id",
    "title": "Ficha Hipertrofia A/B/C",
    "notes": "Descanso de 48h entre membros iguais",
    "startDate": "2026-09-15",
    "endDate": "2026-11-15",
    "divisions": [
      {
        "name": "Treino A - Peito e Tríceps",
        "notes": "Aquecimento de manguito antes",
        "order": 1,
        "exercises": [
          {
            "exerciseId": 1,
            "order": 1,
            "sets": 4,
            "reps": "8 a 10",
            "restInterval": "90s",
            "targetLoad": "25kg",
            "notes": "Pausa de 1s embaixo"
          }
        ]
      }
    ]
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": 1,
    "title": "Ficha Hipertrofia A/B/C",
    "studentId": "uuid-or-student-id",
    "studentName": "Mariana Costa",
    "status": "active",
    "divisionsCount": 1,
    "exercisesCount": 1,
    "createdAt": "2026-09-13T10:00:00.000Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure (e.g. `{ "message": "O título e o aluno são obrigatórios." }` or field-specific errors).
  - `401 Unauthorized`: Not authenticated.
  - `403 Forbidden`: User is not a personal or does not own the student/exercises.

- **Backend Transaction Processing**:
  1. Verify session user is personal.
  2. Validate student belongs to personal's roster.
  3. Validate all referenced `exerciseId` exist and are accessible by the personal.
  4. Begin DB transaction:
     - Insert `TrainingPlan`.
     - Insert all `WorkoutDivision` records.
     - Insert all `WorkoutExercise` records.
     - (Optional) Set any previous active plan for the student to `archived` if replacement is requested.
  5. Commit transaction and return created plan.

---

### 3. Frontend Architecture & Form State Model

- **Directory Structure**:
  - `src/fichas/types.ts`: TypeScript interfaces for inputs, models, form values, and API responses.
  - `src/fichas/api.ts`: API functions (`createTrainingPlan`, `getTrainingPlans`, etc.).
  - `src/pages/NovaFichaTreinoPage.tsx` & `.css`: Main page component containing:
    - Student selection and metadata card.
    - Divisions list with accordion / card layout.
    - Exercise rows with prescription inputs.
    - Exercise Picker Modal to browse/search exercises and add to division.
    - Global action bar (Save button, Cancel button, Status messages).
- **Client Form State Structure**:
  ```ts
  interface FormDivision {
    localId: string // client-only UUID/string for React keys
    name: string
    notes: string
    exercises: FormExercise[]
  }

  interface FormExercise {
    localId: string
    exerciseId: number
    name: string
    muscleGroup: string
    sets: number
    reps: string
    restInterval: string
    targetLoad: string
    notes: string
  }
  ```
- **Initial State**: Starts with 1 division named "Treino A" and empty exercises list.
- **Defaults Pre-filling**: When an exercise is selected from the library modal, `sets` and `reps` default to the exercise's `defaultSets` and `defaultReps`.

---

### 4. MSW Handler & Dev Parity

- Add mock handlers to `src/mocks/handlers.ts` for:
  - `POST /api/fichas-de-treino`: Validates request body, stores mock plan in an in-memory collection, and returns `201 Created`.
  - Update `GET /api/dashboard/personal` or dashboard counts if needed.

## Risks / Trade-offs

- **[Risk] Deep nested form state complexity**
  -> *Mitigation*: Use pure updater functions for division and exercise mutations by `localId`. Keep division and exercise rows modularized to prevent unnecessary re-renders.
- **[Risk] User losing in-progress work if accidentally navigating away**
  -> *Mitigation*: Clear Cancel confirmation if form is dirty; robust client validation before any network request.
- **[Risk] Exercise library or Student list empty**
  -> *Mitigation*: Show helpful empty states and direct action links ("Cadastrar aluno", "Cadastrar exercício") if the personal has not added any students or exercises yet.
