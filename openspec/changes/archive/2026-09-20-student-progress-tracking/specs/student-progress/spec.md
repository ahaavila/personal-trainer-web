## Purpose

Provides a dedicated student progress tracking hub for personal trainers to monitor workout session history and analyze exercise-specific progressive overload with interactive charts and comparison metrics.

## ADDED Requirements

### Requirement: Dedicated progress tracking hub
The system SHALL provide an authenticated, personal-only page at `/evolucao` that allows personal trainers to select a student and view their training progress.

#### Scenario: Personal navigates to progress hub with no student selected
- **WHEN** an authenticated personal navigates to `/evolucao` without an `alunoId` query parameter
- **THEN** the system displays a student selector dropdown and a prompt encouraging the trainer to select a student to inspect progress

#### Scenario: Personal selects a student from the dropdown
- **WHEN** the personal selects a student from the dropdown
- **THEN** the system updates the URL to include `?alunoId=:id` without a full page reload and loads the student's progress data

#### Scenario: Personal navigates with alunoId in query params
- **WHEN** the personal navigates to `/evolucao?alunoId=:id`
- **THEN** the system automatically selects the corresponding student, displays student summary metrics, and loads their progress tabs

#### Scenario: Aluno access is denied
- **WHEN** an authenticated aluno attempts to access `/evolucao`
- **THEN** the system displays a 403 access-denied page and does not display progress data

### Requirement: Direct navigation from alunos list
The system SHALL provide an action in the alunos list table to navigate directly to the selected student's progress view.

#### Scenario: Clicking view progress action on an aluno row
- **WHEN** a personal clicks the progress action on a student row in `/alunos`
- **THEN** the system navigates to `/evolucao?alunoId=:id` without a full page reload, displaying the student's progress view

### Requirement: Workout history session timeline
The system SHALL display a chronological timeline of completed workout sessions for the selected student in the "Histórico de Treinos" tab.

#### Scenario: Viewing workout session timeline
- **WHEN** the "Histórico de Treinos" tab is active for a student who has completed workouts
- **THEN** the system displays each session with completion date, workout division name, duration, and exercise details including completed sets, reps, and max load

#### Scenario: Student has no recorded workouts
- **WHEN** the selected student has not completed any workouts
- **THEN** the system displays a friendly empty state indicating that no workouts have been logged yet

### Requirement: Exercise progressive overload evolution
The system SHALL provide an "Evolução por Exercício" tab for the selected student, featuring an exercise selector, metric summary cards, an interactive SVG progression line chart, and a comparative history table.

#### Scenario: Selecting an exercise for evolution analysis
- **WHEN** the personal selects an exercise in the "Evolução por Exercício" tab
- **THEN** the system displays summary metrics (current max load, total gain, session count), renders an SVG line chart plotting load over time, and lists all sessions with load difference indicators (`+X kg`)

#### Scenario: Student has no history for selected exercise
- **WHEN** no recorded sessions exist for the selected exercise
- **THEN** the system displays an empty state informing that no progress logs exist for this exercise
