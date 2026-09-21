## Purpose

Allows students to view their assigned training plans, inspect routine divisions and exercises, and execute active workout sessions with live timers, per-set load/rep tracking, rest stopwatches, and completion logging.

## Requirements

### Requirement: Student training plans overview
The system SHALL provide a dedicated page at `/ficha-de-treino-atual` accessible to authenticated students, listing all training plans assigned to them and clearly indicating whether each plan is active or inactive/archived.

#### Scenario: Student views assigned training plans
- **WHEN** an authenticated student navigates to `/ficha-de-treino-atual`
- **THEN** the system displays their assigned training plans with title, status badge (Ativo / Inativo), validity period, number of divisions, and an action to open the plan

#### Scenario: Student has no training plans assigned
- **WHEN** an authenticated student opens `/ficha-de-treino-atual` with no assigned plans
- **THEN** the system displays an empty state message informing that the personal trainer has not yet assigned a training plan

### Requirement: Training plan inspection and division breakdown
The system SHALL allow students to open and inspect a training plan to view its workout divisions (e.g. Treino A, Treino B) and each division's prescribed exercises, target sets, repetitions, rest interval, notes, and instructional demonstration video when available.

#### Scenario: Student opens a training plan
- **WHEN** a student clicks the action to view an assigned training plan
- **THEN** the system displays the plan's divisions and their prescribed exercises, with an "Iniciar Treino" button for each division

#### Scenario: Student views exercise with instructional video in inspection modal
- **WHEN** a student inspects a division containing an exercise that has an instructional video
- **THEN** the system displays a "Vídeo" button in the exercise row
- **AND** clicking the button opens the media viewer modal playing the exercise video demonstration

#### Scenario: Student views exercise without video in inspection modal
- **WHEN** a student inspects a division containing an exercise with no video uploaded
- **THEN** the system displays a dash (`—`) in place of the video action button

### Requirement: Active workout execution with live duration timer
The system SHALL allow students to start an active workout session for a selected workout division, initiating a live stopwatch tracking the elapsed duration in minutes and seconds.

#### Scenario: Starting a workout session
- **WHEN** a student clicks "Iniciar Treino" on a workout division
- **THEN** the system opens the interactive workout execution screen, starts a live elapsed timer, and displays the list of exercises to be performed

#### Scenario: Pausing and resuming the workout timer
- **WHEN** a student pauses the live timer during an active session
- **THEN** the timer stops incrementing until the student clicks resume

### Requirement: Exercise set tracking with prescribed reference
The system SHALL display each exercise in the active workout with the prescribed number of sets, providing input fields for the student to record the actual weight (kg) and repetitions performed on each set, alongside the trainer's prescribed values as visual reference and access to exercise demonstration videos.

#### Scenario: Recording load and reps for a set
- **WHEN** a student enters their actual load and completed repetitions for a set
- **THEN** the system stores the values for that set and marks the set as completed

#### Scenario: Viewing prescribed reference targets
- **WHEN** a student views an exercise during an active workout
- **THEN** the system displays the target sets, reps (e.g. "8 a 12"), and target load prescribed by the personal trainer as a guide

#### Scenario: Viewing exercise video during active workout execution
- **WHEN** a student performs an exercise with an associated video during an active workout session
- **THEN** the exercise card header shows a "Vídeo" button
- **AND** clicking the button opens the media viewer modal without interrupting or resetting the active workout timer

#### Scenario: Exercise without video during active workout execution
- **WHEN** an exercise has no demonstration video attached
- **THEN** no video action button is shown in the active workout exercise header

### Requirement: Inter-set rest countdown timer
The system SHALL provide an inter-set rest timer during active workouts that students can trigger with preset durations (e.g. 30s, 60s, 90s, 120s) to count down rest periods.

#### Scenario: Triggering rest timer
- **WHEN** a student clicks a preset rest duration after finishing a set
- **THEN** the system starts a countdown and visually alerts the student when the rest period reaches zero

### Requirement: In-progress session persistence
The system SHALL persist active workout state (elapsed duration, start timestamp, and entered set loads/reps) in local browser storage so that an accidental page refresh or tab close does not cause loss of workout data.

#### Scenario: Reloading page during an active workout
- **WHEN** a student reloads the browser while an active workout is in progress
- **THEN** the system detects the stored session, restores the elapsed timer and all recorded set inputs, and allows the student to continue without data loss

### Requirement: Concluding workout and celebration modal
The system SHALL allow the student to complete their workout by clicking "Finalizar Treino", prompting for optional session notes, submitting the execution log to the backend, clearing local session persistence, and displaying a celebratory completion modal with workout metrics.

#### Scenario: Successfully finishing a workout
- **WHEN** a student clicks "Finalizar Treino" and confirms completion
- **THEN** the system submits the execution details to `POST /api/treinos/execucoes`, clears stored session state, and presents a celebration modal summarizing total time, exercises completed, and max loads achieved
